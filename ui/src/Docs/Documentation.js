import React from 'react';

import './Documentation.scss';

function escaped(json) {
  return JSON.stringify(json, null, 2);
}

function Documentation({ children }) {
  return (
    <div className="documentationBody">
      {children}
      <h1 className="docsTitle">Documentation</h1>
      <h2>Intro</h2>
      <h2>Examples</h2>
      <p>Docs here!</p>

      <h1>STUB4</h1>

      <p>Prototype, test, explore</p>

      <h2>Why</h2>

      <p>
        When building an app or website, tests are your best friends. But sometimes, it's just
        useful to see the thing working. In these cases, you can either point your app at the real
        system you're integrating with, or you can use Stub4 to simulate it. Stub4 allows you to
        explore your app's behaviour without connecting it to a real live system, and because you
        have full control, verify what happens in situations that would be hard to encounter in real
        life.
      </p>

      <h2>What</h2>

      <p>
        The most straighgtforward method Stub4 offers to simulate a real system is a <b>stub</b>. A
        stub is made up by a request matcher, and a response. The idea is that when you make HTTP
        calls to Stub4, if the request received matches an existing stub, you'll get a
        pre-configured response of your choosing. But that's not all. Often, you'll want to simulate
        a variety of scenarios for the same HTTP call, with different outcomes based on the request
        sent. To do this, you can use <b>scenarios</b>. Similarly to stubs, scenarios are made by a
        base request matcher, and then outcomes that will match more specific details of a request
        and return a specific response. You can even setup default values, and only override what
        you need in a given outcome. Another common use case is to simulate straightforward CRUD
        (Create Read Update Delete) applications that follow REST conventions. For that you'll want
        to use a <b>crud</b>, which creates a small in-memory database that you can add and remove
        things from. In some cases, you might want to simulate some of the systems you interact with
        just in some cases or for some time, but normally just use it normally. To help with that
        you can use a <b>proxy</b>. Set one up and all your requests will be proxied over, and the
        responses back to you. When you then want to swap it out for a stub or else, either replace
        the proxy with a stub, or just change the target of the proxy to Stub4 itself.
      </p>

      <h2>How</h2>
      <p>
        There's a few ways you can setup Stub4. One is via the provided web-based interface. Stub4
        will serve you a web app that allows you to manage your setup on the fly, adding and
        removing configuration. This can be useful to demonstrate what your app does when changing
        the response of the systems it integrates with. If you find yourself wanting to setup the
        same configurations many times, or even better through code and config, you can specify your
        desired configuration in one or more json files. Here's a few examples:
      </p>
      <pre className="code">
        {escaped({
          stubs: [
            {
              requestMatcher: { url: '/some-url', method: 'GET' },
              response: { body: 'this was setup', type: 'text' }
            },
            {
              requestMatcher: {
                method: 'POST',
                url: '/body-match',
                body: { bodyMatch: { id: 321 } }
              },
              response: { body: { mgs: 'User 321 created' }, type: 'json' }
            }
          ],
          cruds: [
            {
              requestMatcher: { url: '/some-crud-url' },
              idAlias: 'customerId',
              data: [{ customerId: 1, some: 'content' }, { customerId: 3, some: 'stuff' }]
            }
          ],
          scenarios: [
            {
              requestMatcher: { url: '/dude/{id}' },
              outcomes: [
                { match: { id: 1 }, response: { body: { hey: 'other' } } },
                { match: { id: 2 }, response: { body: { hey: 'other' } } }
              ],
              default: {
                response: { body: { hey: 'some' }, statusCode: 200 }
              }
            }
          ]
        })}
      </pre>
      <p>
        Finally, you might only want some behaviours to be setup for the scope of a test you're
        running. The most effective way of doing this is using the Stub4-client, which will help you
        setup your config from json object, or through builder-like functions.
      </p>

      <h2>Examples</h2>

      <p></p>

      <h2>Upcoming fetures</h2>

      <p>
        I'm still working on making this awesome. Here's some of the things I'm going to be adding
        next:
      </p>
      <ul>
        <li>Delays - Allow you to simulate a slow system, by delaying responses</li>
        <li>
          Codegen - A button on the UI that allows you to export a manually created stub to config
        </li>
        <li>
          Wizards - An even easier way to create stubs and more by pointing Stub4 at Swagger/OpenApi
          documentation
        </li>
        <li>
          Contracts - Actually already partially working but undocumented, the possibility to
          generate pact contracts from stubs definitions, to ensure they are realistic
        </li>
      </ul>
    </div>
  );
}

export { Documentation };
