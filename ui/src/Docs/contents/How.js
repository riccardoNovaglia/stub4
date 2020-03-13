import React from 'react';
import { SectionTitle } from './SectionTitle';

function escaped(json) {
  return JSON.stringify(json, null, 2);
}

function How() {
  return (
    <>
      <SectionTitle title="How to use it" />
      {/* TODO: explain it can be done via config, UI, client */}
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
    </>
  );
}

export { How };
