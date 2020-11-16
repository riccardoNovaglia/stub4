import React from 'react';
import { Code, CodeSnippet, InlineCode as IL, Link, SectionTitle } from '../../DocsBits';
import { startingPath } from './Starting';

const configSample = {
  defaultsFiles: ['./some-path-to-files-with-stubbings.json', './or-some-directory/*'],
  stubsPort: 8080,
  uiPort: 80,
  logging: {
    baseLevel: 'warn',
    toIgnore: ['proxy']
  }
};

export function Config() {
  return (
    <>
      <SectionTitle title="Config" />
      <p>
        There's a few things you can configure in Stub4 when you start it up. Mainly, its ports, and
        logging level.
      </p>
      <h3>When starting Stub4 as an npm command</h3>
      <p>
        If you're starting Stub4 via npm (<Link to={startingPath}>see how to start docs</Link>) you
        can pass as first parameter the path to a configuration file. This will be read by Stub4 at
        start, and used to configure it.
      </p>
      <p> Here's an example:</p>
      <Code>{configSample}</Code>
      <p>
        <IL>stubsPort</IL> and <IL>uiPort</IL> are the two ports Stub4 will pick when starting up.
        They don't have to be specified, and if they aren't, Stub4 will automatically pick available
        ports. They will be logged when the process starts.
        <br />
        In the <IL>logging</IL> block you can specify the base log level. You can also get Stub4 to
        not log any logs from a specific type of stubbing (proxy in the example).
        <br />
        Finally, in <IL>defaultsFiles</IL> you can specify any number of files you'd like Stub4 to
        read to setup its default stubbings at startup. These can be path to individual JSON files,
        or glob expressions.
      </p>
      <h3>When starting Stub4 programmatically</h3>
      <p>
        When starting Stub4 programmatically things are a bit simpler. The Stub4 object has a
        handful of methods you can call, but you'll be mainly interested in <IL>startup</IL> and{' '}
        <IL>startUi</IL>.
        <br />
        <IL>startup</IL> accepts an object with two optional keys: <IL>port</IL> and{' '}
        <IL>logLevel</IL>. When <IL>port</IL> is not specified, Stub4 will pick any free available
        one, and return it once started. <IL>logLevel</IL> sets the lowest level of logs logged.{' '}
        <br />
        <IL>startUi</IL> accepts a similar object, with two optional keys: <IL>port</IL> and{' '}
        <IL>stubsPort</IL>. <IL>port</IL> defines the port where the UI will be served, and any free
        available port will be picked by default. <IL>stubsPort</IL> tells the UI where to go to
        communicate with the stub server. This value is defaulted to the port where the stubs
        started. You should start the stub server before you start the UI.
      </p>
      <CodeSnippet>
        {`stub4.startup({ logLevel: 'info' });
stub4.startUi({ port: 8081 });`}
      </CodeSnippet>
      <h3>When starting Stub4 in tests</h3>
      <p>
        Starting Stub4 in tests is similar to starting it programmatically. You can specify its port
        and log level, but you probably won't need to start its UI. If you're using the{' '}
        <IL>@stub/client</IL> in tests, you can quickly configure its port by passing the value
        returned by Stub4's startup method to the client's <IL>setPort</IL>.
      </p>
      <CodeSnippet>
        {`const { port } = stub4.startup({ logLevel: 'off' });
setPort(port);`}
      </CodeSnippet>
    </>
  );
}

export const configPath = '/stub4/docs/how/config';
