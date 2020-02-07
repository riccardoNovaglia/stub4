const {
  click,
  checkBox,
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
const { get, post, request } = require('axios');
const { appUrl, stubsUrl } = require('../config');

// WHY
jest.setTimeout(100000);

describe('Stubs', () => {
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

  it('Creates a stub that responds with 200', async () => {
    await expect(text('Stubs').exists()).toBeTruthy();
    await expect(text('None created yet').exists()).toBeTruthy();
    await click('create');
    await write('some-url', textBox(toRightOf('URL')));
    await click('save');
    await expect(text('GET /some-url').exists()).toBeTruthy();
    await expect(get(`${stubsUrl}/some-url`)).resolves.toMatchObject({
      status: 200,
      data: {}
    });
  });

  it('Clears existing stubs', async () => {
    await click('create');
    await write('another-url', textBox(toRightOf('URL')));
    await click('save');
    await expect(text('GET /another-url').exists()).toBeTruthy();
    await click('clear');
    await expect(text('None created yet').exists()).toBeTruthy();
    await expect(get(`${stubsUrl}/another-url`)).rejects.toEqual(
      new Error('Request failed with status code 404')
    );
  });

  it('Lets you create a new stub from an existing stub', async () => {
    await click('create');
    await write('the-original-stub', textBox(toRightOf('URL')));
    await click('save');
    await click('the-original-stub');
    await click('edit');
    await expect(text('/the-original-stub', toRightOf('URL')).exists()).toBeTruthy();
    await focus(textBox(toRightOf('URL')));
    await clear();
    await write('a-new-stub', textBox(toRightOf('URL')));
    await click('save');
    await expect(text('GET /the-original-stub').exists()).toBeTruthy();
    await expect(text('GET /a-new-stub').exists()).toBeTruthy();
    await expect(get(`${stubsUrl}/the-original-stub`)).resolves.toMatchObject({
      status: 200
    });
    await expect(get(`${stubsUrl}/a-new-stub`)).resolves.toMatchObject({ status: 200 });
  });

  it('Lets you tweak each part of a stub', async () => {
    await click('create');
    await write('some-new-stub', textBox(toRightOf('URL')));

    await clear(textBox(toRightOf('STATUS')));
    await write('203', textBox(toRightOf('STATUS')));

    await dropDown(toRightOf('METHOD')).select('POST');
    await dropDown(toRightOf('TYPE')).select('application/xml');
    await clear(textBox(toRightOf('BODY')));
    await write('<customer><id>123</id><name>jimbo</name></customer>', textBox(toRightOf('BODY')));
    await click('save');
    await expect(post(`${stubsUrl}/some-new-stub`)).resolves.toMatchObject({
      status: 203,
      data: '<customer><id>123</id><name>jimbo</name></customer>',
      headers: { 'content-type': 'application/xml; charset=utf-8' }
    });
  });

  describe('Body matching', () => {
    it('Creates a stub with body matching', async () => {
      await click('create');
      await write('with-body-match', textBox(toRightOf('URL')));
      await dropDown(toRightOf('METHOD')).select('POST');
      await click(checkBox(toRightOf('Body matching')));

      await write('{"abc": "cde", "asd": 123}', textBox(toRightOf('BODY MATCHER')));

      await clear(textBox(toRightOf('BODY')));
      await dropDown(toRightOf('TYPE')).select('application/json');
      await write('{"msg": "this is ok"}', textBox(toRightOf('BODY')));
      await click('save');

      await expect(get(`${stubsUrl}/with-body-match`)).rejects.toEqual(
        new Error('Request failed with status code 404')
      );
      await expect(
        request({
          url: `${stubsUrl}/with-body-match`,
          method: 'POST',
          data: { abc: 'cde', asd: 123 }
        })
      ).resolves.toMatchObject({
        status: 200,
        data: { msg: 'this is ok' },
        headers: { 'content-type': 'application/json; charset=utf-8' }
      });
    });

    it('Creates a stub with xml body matching', async () => {
      await click('create');
      await write('with-body-match', textBox(toRightOf('URL')));
      await dropDown(toRightOf('METHOD')).select('POST');
      await click(checkBox(toRightOf('Body matching')));
      await dropDown(toRightOf('BODY TYPE')).select('XML');

      await write(
        '[{ "path": "string(//customer/name)", "value": "jimbo" }]',
        textBox(toRightOf('BODY MATCHER'))
      );

      await clear(textBox(toRightOf('BODY')));
      await write('ok', textBox(toRightOf('BODY')));
      await click('save');

      await expect(
        post(`${stubsUrl}/with-body-match`, '<customer><id>123</id><name>jimbo</name></customer>', {
          headers: { 'Content-Type': 'text/xml' }
        })
      ).resolves.toMatchObject({
        status: 200,
        data: 'ok'
      });
    });
  });
});
