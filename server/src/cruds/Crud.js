const _ = require('lodash');
const { createLogger } = require('../logger');

const logger = createLogger('crud ');

function Crud(url, idAlias, patchOnPost) {
  const data = { url, meta: { idAlias }, db: DB({ idAlias }), patchOnPost };

  function idFromUrl(urlToParse) {
    return urlToParse.split('/').pop();
  }

  return {
    ...data,
    matches(url) {
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
      return JSON.stringify({ url: this.url, meta: this.meta, items: this.db.items }, null, 2);
    },
    simple() {
      return { url: this.url, idAlias: this.meta.idAlias };
    }
  };
}

function DB(meta) {
  return {
    meta,
    items: [],
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

function getIdAlias(source) {
  const alias = _.get(source, 'idAlias', 'id');
  return _.isEmpty(alias) ? 'id' : alias;
}

function getPatchOnPost(source) {
  return _.get(source, 'patchOnPost', 'false');
}

function crudFromRequest(req) {
  const url = req.body.requestMatcher.url;
  const idAlias = getIdAlias(req.body.crud);
  return Crud(url, idAlias, getPatchOnPost(req.body));
}

function CrudFromFile(item) {
  const url = item.requestMatcher.url;
  const idAlias = getIdAlias(item);
  const crud = Crud(url, idAlias, getPatchOnPost(item));
  item.data.forEach((dataItem) => crud.push(dataItem));
  return crud;
}

module.exports = { Crud, crudFromRequest, CrudFromFile };
