import React from 'react';
import { Code, InlineCode, SectionTitle, Link, CodeSnippet } from '../../DocsBits';

export function Starting() {
  return (
    <>
      <SectionTitle title="Starting Stub4" />
      <p>
        You can start Stub4 in a few different ways, to cater for different situations. You can use
        it as an npm command, start it programmatically via javascript, or start it in your tests
        directly.
      </p>
      <h3>Starting Stub4 as an npm command</h3>
      <p>
        To start Stub4 as an npm command, after installation, add a script to your package.json that
        calls Stub4, and pass as its first parameter the path to your configuration file.
        <br />
        (An alternative to this step is installing Stub4 globally. In that case you won't need to
        define a command in your project's package.json)
        <br />
        In it you can configure its ports, and logging, and configure files that contain your
        stubbings. These will be picked up as Stub4 starts. You can add more stubbings later via its
        API and UI.
      </p>
      <p>In your package.json:</p>
      <Code>
        {{
          scripts: {
            stub4: 'stub4 config.json'
          }
        }}
      </Code>
      <p>Then in your console:</p>
      <InlineCode>{'$ npm run stub4'}</InlineCode>
      <p>
        You can learn more about configuring Stub4 <Link to="/stub4/docs/how/config">here</Link>
      </p>

      <h3>Starting Stub4 programmatically</h3>
      <p>
        While setting up your stubbings in JSON files is convenient, sometimes you might want a bit
        more flexibility and power. In those cases, switching to starting and setting up Stub4
        programmatically might be a better option.
      </p>
      <CodeSnippet>{`// In yourStub4Config.js
const stub4 = require('@stub4/stub4');

stub4.addItems([
  {
    requestMatcher: { url: '/something' },
    response: { body: 'ok' }
  }
]);

stub4.startup({ logLevel: 'info' });
stub4.startUi({ port: 8081 });
      `}</CodeSnippet>
      <p>
        With this, you have lots more options on how to organise and generate your test data, for
        example, allowing you to create variables and share them between different stubbings, or use
        builders to simplify your setup.
      </p>
      <p>
        Once you are happy with your setup, add a script to your package.json to invoke your file.
      </p>
      <CodeSnippet>{`// In your package.json
{
  "scripts": "node yourStub4Config.js"
}
      `}</CodeSnippet>
      <p>
        (Something like <InlineCode>nodemon</InlineCode> can be quite useful here.)
      </p>
      <h3>Using Stub4 in your tests</h3>
      <p>
        You can start and stop Stub4 right in your tests, allowing you to add stubbings specific to
        your test cases, and not having to keep Stub4 running in the background.
      </p>
      <CodeSnippet>{`const stub4 = require('@stub4/stub4');
const { stubFor, setPort } = require('@stub4/client');

describe('uses before each and after each to start and stop stub4', () => {
  beforeAll(() => {
    const { port } = stub4.startup();
    setPort(port);
  });

  afterEach(() => stub4.clearAll());
  afterAll(() => stub4.shutdown());

  test('creates a stub', async () => {
    const port = stub4.stubsPort();
    await stubFor({ 
      requestMatcher: { url: '/some-url' }, 
      response: { statusCode: 201, body: { message: 'test' } } 
    });

    const stubbedResponse = await axios.get(\`http://localhost:$\{port}/some-url\`);
    expect(stubbedResponse.status).toEqual(201);
    expect(stubbedResponse.data).toEqual({ message: 'test' });
  });
)}
      `}</CodeSnippet>
    </>
  );
}

export const startingPath = '/stub4/docs/how/starting';
