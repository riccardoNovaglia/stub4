const {
  openBrowser,
  goto,
  click,
  write,
  closeBrowser,
  textBox,
  toRightOf,
  text
} = require('taiko');
const axios = require('axios');

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
  });
  afterEach(async () => {
    await closeBrowser();
  });

  it('Creates a stub that responds with 200', async () => {
    await goto(appUrl);
    await text('Stubs').exists();
    await text('None created yet').exists();
    await click('create');
    await writeUrl('some-url');
    await click('save');
    await text('GET /some-url').exists();
    const response = await axios.get(`${stubsUrl}/some-url`);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual({});
  });

  it('Clears existing stubs', async () => {
    await goto(appUrl);
    await click('create');
    await writeUrl('another-url');
    await click('save');
    await text('GET /another-url').exists();
    await click('clear');
    await text('None created yet').exists();
    await expect(axios.get(`${stubsUrl}/another-url`)).rejects.toEqual(
      new Error('Request failed with status code 404')
    );
  });
});

async function writeUrl(url) {
  // why do I have to add a space to make it write the last letter?!?
  await write(`${url} `, textBox(toRightOf('URL')));
}
