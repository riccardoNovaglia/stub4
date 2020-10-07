const _ = require('lodash');
const { v4: uuid } = require('uuid');

const { createLogger } = require('../logger');

const logger = createLogger('crud ');

function Crud({ id = uuid(), enabled = true, url, idAlias, db, patchOnPost }) {
  const data = { url, meta: { idAlias }, db, patchOnPost };

  function idFromUrl(urlToParse) {
    return urlToParse.split('/').pop();
  }

  return {
    ...data,
    id,
    enabled,
    matches(url) {
      if (!this.enabled) return false;
      // TODO: make this into specific request/url matcher
      const matches = url.includes(this.url);
      logger.silly(`${this.pretty()} ${matches ? 'does' : "doesn't"} match ${url}`);
      return matches;
    },
    mightHaveIdFor(url) {
      const maybeId = url.replace(`${this.url}`, '').replace('/', '');
      return !_.isEmpty(maybeId) && !maybeId.includes('/');
    },
    getItem(url) {
      const id = idFromUrl(url);
      return this.db.get(id);
    },
    getResponse(url, method, body, res) {
      switch (method) {
        case 'GET': {
          if (this.mightHaveIdFor(url)) {
            const item = this.getItem(url);
            if (item !== undefined) {
              return res.json(item);
            } else {
              res.sendStatus(404);
            }
            return res.json(item);
          } else {
            return res.json(this.allItems());
          }
        }
        case 'POST': {
          this.push(body);
          return res.end();
        }
        case 'PATCH': {
          this.patch(body);
          return res.end();
        }
        case 'DELETE': {
          this.delete(url);
          return res.end();
        }
        default:
          break;
      }
    },
    push(item) {
      return patchOnPost ? this.db.patch(item) : this.db.upsert(item);
    },
    patch(item) {
      return this.db.patch(item);
    },
    delete(url) {
      if (this.mightHaveIdFor(url)) {
        const id = idFromUrl(url);
        this.db.remove(id);
      } else {
        return undefined;
      }
    },
    allItems() {
      return this.db.items;
    },
    pretty() {
      return `'${url} - ${idAlias} - ${patchOnPost ? "patchOnPost:true'" : "'"}`;
    },
    prettyJson() {
      return JSON.stringify(
        { id: this.id, url: this.url, meta: this.meta, items: this.db.items },
        null,
        2
      );
    },
    simple() {
      return { id: this.id, enabled: this.enabled, url: this.url, idAlias: this.meta.idAlias };
    },
    toJson() {
      return {
        id: this.id,
        enabled: this.enabled,
        requestMatcher: { url: this.url },
        crud: { meta: this.meta, items: this.db.items }
      };
    },
    setEnabled(enabled) {
      this.enabled = enabled;
      return this.enabled;
    }
  };
}

function DB(meta, items = []) {
  return {
    meta,
    items,
    get(id) {
      logger.debug(`Trying to get item from crud with id ${id} - ${JSON.stringify(this.items)}`);
      return this.items.find((item) => this.idFrom(item).toString() === id.toString());
    },
    upsert(item) {
      const maybeAlreadyExisting = this.get(this.idFrom(item));
      if (maybeAlreadyExisting) {
        this.items.splice(this.items.indexOf(maybeAlreadyExisting), 1, item);
        logger.debug(`Updating existing item into crud`);
      } else {
        this.items.push(item);
        logger.debug(`Pushed item into crud. Now ${this.items.length} items`);
      }
      return this.idFrom(item);
    },
    patch(item) {
      const maybeAlreadyExisting = this.get(this.idFrom(item));
      if (maybeAlreadyExisting) {
        this.items.splice(this.items.indexOf(maybeAlreadyExisting), 1, {
          ...maybeAlreadyExisting,
          ...item
        });
        logger.debug(`Patched existing item into crud`);
      } else {
        this.items.push(item);
        logger.debug(`Pushed item into crud. Now ${this.items.length} items`);
      }
      return this.idFrom(item);
    },
    remove(id) {
      const item = this.get(id);
      this.items.splice(this.items.indexOf(item), 1);
      logger.silly(`Deleted. Items now ${JSON.stringify(this.items)}`);
      return this.idFrom(item);
    },
    idFrom(item) {
      return item[this.meta.idAlias];
    }
  };
}

function crudFromRequest(req) {
  return CrudFromItem(req.body);
}

function CrudFromFile(item) {
  return CrudFromItem(item);
}

function CrudFromJs(item) {
  return CrudFromItem(item);
}

function CrudFromItem(item) {
  const {
    id,
    enabled,
    requestMatcher: { url },
    crud: { idAlias = 'id', patchOnPost = false, items }
  } = item;
  const db = DB({ idAlias }, items);
  return Crud({ id, enabled, url, db, idAlias, patchOnPost });
}

module.exports = { Crud, crudFromRequest, CrudFromFile, CrudFromJs };
