const { clear, get, add } = require('../Cruds');
const { CrudFromFile } = require('../Crud');

afterEach(clear);

it('creates a crud with some data', () => {
  const someItem = { id: '1', some: 'content' };

  add(
    CrudFromFile({
      requestMatcher: { url: '/some-url' },
      crud: { items: [someItem] }
    })
  );

  const crud = get('/some-url/1');
  expect(crud.toJson().crud.items).toEqual([someItem]);
});

it('creates a crud with some data and custom id alias', () => {
  const someItem = { bananaId: '1', status: 'ripe' };

  add(
    CrudFromFile({
      requestMatcher: { url: '/bananas/v21' },
      crud: { idAlias: 'bananaId', items: [someItem] }
    })
  );

  const item = get('/bananas/v21/1', 'GET');
  const { crud } = item.toJson();
  expect(crud.meta.idAlias).toEqual('bananaId');
  expect(crud.items).toEqual([someItem]);
});

it('creates a crud patch on post', () => {
  const crud = CrudFromFile({
    requestMatcher: { url: '/bananas/v21' },
    crud: { items: [], patchOnPost: true }
  });
  expect(crud.patchOnPost).toBeTruthy();
});

it('loads multiple cruds', () => {
  const aBanana = { bananaId: '1', status: 'ripe' };
  const things = [
    { id: '1', status: 'ripe' },
    { id: '2', status: 'not ripe' }
  ];

  add(
    CrudFromFile({
      requestMatcher: { url: '/bananas/v21' },
      crud: { idAlias: 'bananaId', items: [aBanana] }
    })
  );
  add(
    CrudFromFile({
      requestMatcher: { url: '/other-url' },
      crud: { items: things }
    })
  );

  const bananas = get('/bananas/v21/1', 'GET');
  expect(bananas.toJson().crud.items).toEqual([aBanana]);
  const other = get('/other-url', 'GET');
  expect(other.toJson().crud.items).toEqual(things);
});
