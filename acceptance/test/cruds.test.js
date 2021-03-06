const {
  below,
  click,
  clear,
  closeBrowser,
  dropDown,
  focus,
  goto,
  openBrowser,
  text,
  textBox,
  toRightOf,
  write
} = require('taiko');
const axios = require('axios');
const { get } = require('axios');
const { appUrl, stubsUrl } = require('../config');

// WHY
jest.setTimeout(100000);

describe('Cruds', () => {
  // beforeAll(async () => await openBrowser({ headless: false }));
  beforeAll(async () => await openBrowser());
  afterAll(async () => await closeBrowser());
  beforeEach(async () => {
    await axios.delete(`${stubsUrl}/stubs`);
    await axios.delete(`${stubsUrl}/cruds`);
    await axios.delete(`${stubsUrl}/proxy`);
    await axios.delete(`${stubsUrl}/scenarios`);
    await goto(appUrl);
  });

  it('Creates a crud with an id alias', async () => {
    await click('Cruds');
    await expect(text('None created yet').exists()).toBeTruthy();
    await click('create');
    await write('some-crud-url', textBox(toRightOf('URL')));
    await write('idAlias', textBox(toRightOf('ID ALIAS')));
    await click('save');
    await expect(text('/some-crud-url→idAlias').exists()).toBeTruthy();
    await click('/some-crud-url');
    await expect(text('0 items found').exists()).toBeTruthy();
  });

  it('Creates a crud with alias and adds an item', async () => {
    await click('Cruds');
    await click('create');
    await write('some-crud-url', textBox(toRightOf('URL')));
    await write('personId', textBox(toRightOf('ID ALIAS')));
    await click('save');
    await click('/some-crud-url');
    await click('edit');
    await clear(textBox(below('edit')));
    await write('[{"personId": 123,"name":"jimmy"}]', textBox(below('edit')));
    await click('save');
    await click('/some-crud-url');
    await expect(text('1 items found').exists()).toBeTruthy();
    await expect(get(`${stubsUrl}/some-crud-url/123`)).resolves.toMatchObject({
      status: 200,
      data: { personId: 123, name: 'jimmy' }
    });
  });
});
