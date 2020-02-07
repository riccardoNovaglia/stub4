const {
  click,
  clear,
  closeBrowser,
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

describe('Proxy', () => {
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

  it('creates a stub, a proxy, calls the proxy and gets the stub response', async () => {
    await click('stubs');
    await click('create');
    await write('to-be-proxied-to', textBox(toRightOf('URL')));
    await clear(textBox(toRightOf('BODY')));
    await write('ok', textBox(toRightOf('BODY')));
    await click('save');

    await click('proxy');
    await click('create');
    await write('proxy-url', textBox(toRightOf('URL')));
    await write(`${stubsUrl}/to-be-proxied-to`, textBox(toRightOf('PROXY URL')));
    await click('save');

    await expect(get(`${stubsUrl}/proxy-url`)).resolves.toMatchObject({
      status: 200,
      data: 'ok'
    });
  });
});
