const { clearAll, get, getAll, load } = require('./stubbing');

describe('Loading dbs from an initialiser file', () => {
  afterEach(clearAll);

  it('creates a db with some data', () => {
    const someItem = { id: '1', some: 'content' };

    load([
      {
        meta: { url: '/some-url' },
        data: [someItem]
      }
    ]);

    const item = get('/some-url', someItem.id);
    expect(item).toEqual(someItem);
  });

  it('creates a db with some data and custom id alias', () => {
    const someItem = { bananaId: '1', status: 'ripe' };

    load([
      {
        meta: { url: '/bananas/v21', idAlias: 'bananaId' },
        data: [someItem]
      }
    ]);

    const item = get('/bananas/v21', someItem.bananaId);
    expect(item).toEqual(someItem);
  });

  it('loads multiple dbs', () => {
    const aBanana = { bananaId: '1', status: 'ripe' };
    const things = [{ id: '1', status: 'ripe' }, { id: '2', status: 'not ripe' }];
    load([
      {
        meta: { url: '/bananas/v21', idAlias: 'bananaId' },
        data: [aBanana]
      },
      {
        meta: { url: '/other-url' },
        data: things
      }
    ]);

    expect(get('/bananas/v21', 1)).toEqual(aBanana);
    expect(getAll('/other-url')).toEqual(things);
  });
});
