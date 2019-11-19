const {
  openBrowser,
  goto,
  click,
  write,
  reload,
  press,
  focus,
  highlight,
  closeBrowser,
  dropDown,
  near,
  text
} = require('taiko');

jest.setTimeout(10000);

describe('something', () => {
  beforeEach(async () => await openBrowser({ headless: false }));
  afterEach(async () => await closeBrowser());

  it('does things', async () => {
    try {
      await goto('localhost');
      await click('New');
      // await write('hello-world');
      // await click('save');
      // await click('hello-world');
      // await click('edit');
      // await click('close');
      // await click('clear');
      // await reload();
      // await click('new');
      // await dropDown('stub');
      await highlight(dropDown(near('create new')));
      await focus(dropDown(near('create new')));
      await dropDown(near('create new')).select('crud');
      await click(dropDown(near('create new')));
      await click(dropDown(near('create new')));
      await press('Space');
      console.log('checking');
      await text('ID ALIAS').exists();
      await wait();
      await dropDown(near('create new')).select('stub');
      await wait();
      // await click(dropDown(near('create new')));
      // await doubleClick(dropDown(near('create new')));
      // await focus(dropDown(near('create new')));
      // await click(dropDown(near('create new')));
      // await click(dropDown(near('create new')));
      // click(dropDown(near('create new')));
      // await click(dropDown(near('create new')));
      // press('Enter');
      // await press('Enter');
      // click(dropDown(near('create new')));
      // await press('Enter');
      // click(dropDown(near('create new')));
      // press('Enter');
    } catch (error) {
      console.error(error);
      throw error;
    }
  });
});

function wait(ms = 1000) {
  return new Promise(res => setTimeout(res, ms));
}
