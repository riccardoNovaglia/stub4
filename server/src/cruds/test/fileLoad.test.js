const { clear, get, add } = require('../Cruds');
const { CrudFromFile } = require('../Crud');

afterEach(clear);

it('creates a crud with some data', () => {
  const someItem = { id: '1', some: 'content' };

  add(
    CrudFromFile({
      requestMatcher: { url: '/some-url' },
      data: [someItem]
    })
  );

  const item = get('/some-url/1', 'GET');
  expect(item).toEqual(someItem);
});

it('creates a crud with some data and custom id alias', () => {
  const someItem = { bananaId: '1', status: 'ripe' };

  add(
    CrudFromFile({
      requestMatcher: { url: '/bananas/v21' },
      idAlias: 'bananaId',
      data: [someItem]
    })
  );

  const item = get('/bananas/v21/1', 'GET');
  expect(item).toEqual(someItem);
});

it('creates a crud patch on post', () => {
  const crud = CrudFromFile({
    requestMatcher: { url: '/bananas/v21' },
    data: [],
    patchOnPost: true
  });
  expect(crud.patchOnPost).toBeTruthy();
});

it('loads multiple cruds', () => {
  const aBanana = { bananaId: '1', status: 'ripe' };
  const things = [{ id: '1', status: 'ripe' }, { id: '2', status: 'not ripe' }];

  add(
    CrudFromFile({
      requestMatcher: { url: '/bananas/v21' },
      idAlias: 'bananaId',
      data: [aBanana]
    })
  );
  add(
    CrudFromFile({
      requestMatcher: { url: '/other-url' },
      data: things
    })
  );

  expect(get('/bananas/v21/1', 'GET')).toEqual(aBanana);
  expect(get('/other-url', 'GET')).toEqual(things);
});
