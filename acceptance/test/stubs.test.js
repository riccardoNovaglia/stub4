const {
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
const { get, post } = require('axios');

// WHY
jest.setTimeout(100000);

const appUrl = 'localhost:8081';
const stubsUrl = 'http://localhost:8080';

describe('Stubs', () => {
  beforeEach(async () => {
    // await openBrowser({ headless: false });
    await openBrowser();
    await axios.delete(`${stubsUrl}/stubs`);
    await axios.delete(`${stubsUrl}/cruds`);
    await axios.delete(`${stubsUrl}/proxy`);
    await axios.delete(`${stubsUrl}/scenarios`);
    await goto(appUrl);
  });
  afterEach(async () => {
    await closeBrowser();
  });

  it('Creates a stub that responds with 200', async () => {
    await text('Stubs').exists();
    await text('None created yet').exists();
    await click('create');
    await writeUrl('some-url');
    await click('save');
    await text('GET /some-url').exists();
    await expect(get(`${stubsUrl}/some-url`)).resolves.toMatchObject({
      status: 200,
      data: {}
    });
  });

  it('Clears existing stubs', async () => {
    await click('create');
    await writeUrl('another-url');
    await click('save');
    await text('GET /another-url').exists();
    await click('clear');
    await text('None created yet').exists();
    await expect(get(`${stubsUrl}/another-url`)).rejects.toEqual(
      new Error('Request failed with status code 404')
    );
  });

  it('Lets you create a new stub from an existing stub', async () => {
    await click('create');
    await writeUrl('the-original-stub');
    await click('save');
    await click('the-original-stub');
    await click('edit');
    await text('/the-original-stub', toRightOf('URL')).exists();
    await focus(textBox(toRightOf('URL')));
    await clear();
    await writeUrl('a-new-stub');
    await click('save');
    await text('GET /the-original-stub').exists();
    await text('GET /a-new-stub').exists();
    await expect(get(`${stubsUrl}/the-original-stub`)).resolves.toMatchObject({
      status: 200
    });
    await expect(get(`${stubsUrl}/a-new-stub`)).resolves.toMatchObject({ status: 200 });
  });

  it('Lets you tweak each part of a stub', async () => {
    await click('create');
    await writeUrl('some-new-stub');

    await clear(textBox(toRightOf('STATUS')));
    await write('203', textBox(toRightOf('STATUS')));

    await dropDown(toRightOf('METHOD')).select('POST');
    await dropDown(toRightOf('TYPE')).select('application/xml');
    await clear(textBox(toRightOf('BODY')));
    await write('<customer><id>123</id><name>jimbo</name></customer> ', textBox(toRightOf('BODY')));
    await click('save');
    await expect(post(`${stubsUrl}/some-new-stub`)).resolves.toMatchObject({
      status: 203,
      data: '<customer><id>123</id><name>jimbo</name></customer>',
      headers: { 'content-type': 'application/xml; charset=utf-8' }
    });
  });
});

async function writeUrl(url) {
  // why do I have to add a space to make it write the last letter?!?
  // turns out to be the last thing I write, not necessarily just the url
  // just the last thing written on the page before submittin or something?!
  await write(`${url} `, textBox(toRightOf('URL')));
}
