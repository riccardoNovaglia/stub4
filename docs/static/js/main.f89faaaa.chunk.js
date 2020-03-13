(this.webpackJsonpui = this.webpackJsonpui || []).push([
  [0],
  {
    17: function(e, t, a) {
      e.exports = a(31);
    },
    22: function(e, t, a) {},
    28: function(e, t, a) {},
    29: function(e, t, a) {},
    30: function(e, t, a) {},
    31: function(e, t, a) {
      'use strict';
      a.r(t);
      var n = a(0),
        l = a.n(n),
        o = a(14),
        s = a.n(o),
        r = a(6),
        c = a(5);
      a(22);
      function u() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement('h2', { className: 'indexTitle' }, 'Index'),
          l.a.createElement(
            'ul',
            null,
            l.a.createElement(i, { label: 'Motivation', path: '/docs/why' }),
            l.a.createElement(i, { label: 'How it works', path: '/docs/what' }),
            l.a.createElement(i, { label: 'How to use it', path: '/docs/how' }),
            l.a.createElement(m, {
              label: 'How to stub',
              path: '/docs/how/stubs',
              parentPath: '/docs/how'
            }),
            l.a.createElement(i, { label: 'Next', path: '/docs/next' })
          )
        );
      }
      function i(e) {
        var t,
          a = e.path,
          n = e.label,
          o = Object(c.g)().pathname;
        return l.a.createElement(
          'li',
          { className: 'indexListItem', key: a },
          l.a.createElement(
            r.b,
            { to: a, className: ((t = a), o.startsWith(t) ? 'selectedDocsLink' : 'docsLink') },
            n
          )
        );
      }
      function m(e) {
        var t = e.path,
          a = e.parentPath,
          n = e.label,
          o = Object(c.g)().pathname,
          s = o === t ? 'selectedSubDocsLink' : 'subDocsLink';
        return (
          o.startsWith(a) &&
          l.a.createElement(
            'li',
            { className: 'indexListSubItem', key: t },
            l.a.createElement(r.b, { to: t, className: s }, n)
          )
        );
      }
      a(28);
      function h(e) {
        var t = e.children;
        return l.a.createElement(c.d, null, t);
      }
      function d(e) {
        var t = e.title;
        return l.a.createElement('h2', { className: 'contentsTitle' }, t);
      }
      function p() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement(d, { title: 'Why' }),
          l.a.createElement(
            'p',
            null,
            'When building an app or website, tests are your best friends.'
          ),
          l.a.createElement(
            'p',
            null,
            "But sometimes, it's just useful to start the thing and see it working."
          ),
          l.a.createElement(
            'p',
            null,
            "In these cases, you can either point your app at the real system you're integrating with and hope for the best, or you can use Stub4 to simulate it."
          ),
          l.a.createElement(
            'p',
            null,
            "Stub4 allows you to explore your app's behaviour without connecting it to a real live system, and because you have full control, verify what happens in situations that would be hard to encounter in real life."
          ),
          l.a.createElement(
            'p',
            null,
            'You can use if prototyping, testing, demonstrating, and more'
          )
        );
      }
      function y() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement(d, { title: 'What' }),
          l.a.createElement('p', null, 'Stub4 offers a few tools to simulate systems'),
          l.a.createElement('h3', null, 'Stubs'),
          l.a.createElement(
            'p',
            null,
            'The most straighgtforward tool Stub4 offers to simulate a real system is a',
            ' ',
            l.a.createElement('span', { className: 'highlightedTerm' }, 'stub'),
            '. A stub is a simple request-response setup. Given a request matching some parameters, a pre-configured response is returned.'
          ),
          l.a.createElement(
            'p',
            null,
            'You can find how to create and use a stub',
            ' ',
            l.a.createElement(
              'a',
              { href: '/docs/how/stubs', className: 'linkToOtherDocs' },
              'here'
            )
          ),
          l.a.createElement('p', null, "But that's not all."),
          l.a.createElement('h3', null, 'Scenarios'),
          l.a.createElement(
            'p',
            null,
            "Often, you'll want to simulate a variety of scenarios for the same HTTP call, with different outcomes based on the request sent. To do this, you can use",
            ' ',
            l.a.createElement('span', { className: 'highlightedTerm' }, 'scenarios'),
            '. Scenarios are similar to stubs, but simplify the process of setting up different responses based on the parameters of the request. You can even setup default values, and only override what you need in a given outcome.'
          ),
          l.a.createElement(
            'p',
            null,
            'You can find how to create and use scenarios',
            ' ',
            l.a.createElement(
              'a',
              { href: '/docs/how/scenarios', className: 'linkToOtherDocs' },
              'here'
            )
          ),
          l.a.createElement('h3', null, 'Cruds'),
          l.a.createElement(
            'p',
            null,
            "Another common use case is to simulate straightforward CRUD (Create Read Update Delete) applications that follow REST conventions. For that you'll want to use a",
            ' ',
            l.a.createElement('span', { className: 'highlightedTerm' }, 'crud'),
            ', which creates a small in-memory database that you can add and remove things from via HTTP calls.'
          ),
          l.a.createElement(
            'p',
            null,
            'You can find how to create and use cruds',
            ' ',
            l.a.createElement(
              'a',
              { href: '/docs/how/cruds', className: 'linkToOtherDocs' },
              'here'
            )
          ),
          l.a.createElement('h3', null, 'Proxy'),
          l.a.createElement(
            'p',
            null,
            'In some cases, you might just want to let the traffic reach your downstream systems instead of stubbing it. For that, you can use a ',
            l.a.createElement('span', { className: 'highlightedTerm' }, 'proxy'),
            '. As the name suggests, all requests hitting a proxy will be forwarded over to a configured target, and responses then relied back to your app.',
            l.a.createElement('br', null),
            'This can be useful if you want to simulate your system only in some situations or for specific cases.'
          ),
          l.a.createElement(
            'p',
            null,
            'You can find how to create and use a proxy',
            ' ',
            l.a.createElement(
              'a',
              { href: '/docs/how/proxy', className: 'linkToOtherDocs' },
              'here'
            )
          )
        );
      }
      function E() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement(d, { title: 'How to use it' }),
          l.a.createElement(
            'p',
            null,
            "There's a few ways you can setup Stub4. One is via the provided web-based interface. Stub4 will serve you a web app that allows you to manage your setup on the fly, adding and removing configuration. This can be useful to demonstrate what your app does when changing the response of the systems it integrates with. If you find yourself wanting to setup the same configurations many times, or even better through code and config, you can specify your desired configuration in one or more json files. Here's a few examples:"
          ),
          l.a.createElement(
            'pre',
            { className: 'code' },
            ((e = {
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
                  default: { response: { body: { hey: 'some' }, statusCode: 200 } }
                }
              ]
            }),
            JSON.stringify(e, null, 2))
          ),
          l.a.createElement(
            'p',
            null,
            "Finally, you might only want some behaviours to be setup for the scope of a test you're running. The most effective way of doing this is using the Stub4-client, which will help you setup your config from json object, or through builder-like functions."
          )
        );
        var e;
      }
      function b() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement(d, { title: 'Stubs' }),
          l.a.createElement(
            'p',
            null,
            'If you want to simulate an HTTP request-response setup, a stub is a great start. You define how to match a given request, and setup a canned response that will be returned.'
          ),
          l.a.createElement('p', null, 'A complete stub definition will look a bit like this:'),
          l.a.createElement(w, null, {
            requestMatcher: { url: '/some-url', method: 'POST', body: { bodyMatch: { id: 321 } } },
            response: { body: { mgs: 'User 321 created' }, type: 'json' }
          }),
          l.a.createElement(g, null),
          l.a.createElement(f, null)
        );
      }
      function f() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement('h3', null, 'Response definition'),
          l.a.createElement(
            'p',
            null,
            'A stub response is defined by a ',
            l.a.createElement(v, null, 'statusCode'),
            ',',
            ' ',
            l.a.createElement(v, null, 'type'),
            ', and ',
            l.a.createElement(v, null, 'body'),
            ". Here's an example:"
          ),
          l.a.createElement(w, null, {
            statusCode: 201,
            type: 'application/json',
            body: { message: 'Item created successfully', itemId: '321' }
          }),
          l.a.createElement(
            'p',
            null,
            'At the moment all properties are optional, but the ',
            l.a.createElement(v, null, 'response'),
            ' section needs to be added (this might well change in the future). All properties have default values: ',
            l.a.createElement(v, null, 'statusCode'),
            ' defaults to ',
            l.a.createElement(v, null, '200'),
            ',',
            ' ',
            l.a.createElement(v, null, 'type'),
            ' defaults to ',
            l.a.createElement(v, null, 'application/json'),
            ', and',
            ' ',
            l.a.createElement(v, null, 'body'),
            ' defaults to ',
            l.a.createElement(v, null)
          )
        );
      }
      function g() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement('h3', null, 'Request Matching'),
          l.a.createElement(
            'p',
            null,
            'The request matcher in a stub must contain at minimum a ',
            l.a.createElement(v, null, 'url'),
            '. If the request received matches the url exactly, the response is sent back.'
          ),
          l.a.createElement(
            'p',
            null,
            'The method matcher and the body matcher are both optional and are going to be compared on top of the url matching. If you want to explicitly match any method, you can use',
            ' ',
            l.a.createElement(v, null, "method: '*'"),
            '. This is equivalent to omitting the method matcher.',
            ' ',
            l.a.createElement('br', null),
            'As the name suggests, the method matcher ensures the method on the request matches the given value. By default any method is accepted and will return a successful response.'
          ),
          l.a.createElement(
            'p',
            null,
            'The body matcher will match the contents of the request received. A body matcher can be used for json, as well as xml content. ',
            l.a.createElement('br', null),
            'For json, ',
            l.a.createElement(v, null, 'body'),
            ' will contain a ',
            l.a.createElement(v, null, 'bodyMatch'),
            ', that will compare key-value pairs. ',
            l.a.createElement('br', null),
            "For xml, you'll need to add ",
            l.a.createElement(v, null, "type: 'xml'"),
            ', and a list of',
            ' ',
            l.a.createElement(v, null, 'path'),
            ' and ',
            l.a.createElement(v, null, 'value'),
            ' pairs. The paths are',
            ' ',
            l.a.createElement(
              'a',
              {
                href: 'https://developer.mozilla.org/en-US/docs/Web/XPath',
                className: 'linkToOtherDocs'
              },
              'xPath'
            ),
            ' ',
            'expressions that will be executed agains the request body received. Their output is then compared to the value provided.',
            l.a.createElement('br', null),
            "Here's an example:",
            ' '
          ),
          l.a.createElement(w, null, {
            requestMatcher: {
              method: 'POST',
              url: '/body-match-xml',
              body: { type: 'xml', bodyMatch: [{ path: 'string(//author)', value: 'somebody' }] }
            }
          })
        );
      }
      function w(e) {
        var t = e.children;
        return l.a.createElement('pre', { className: 'code' }, JSON.stringify(t, null, 2));
      }
      function v(e) {
        var t = e.children;
        return l.a.createElement('span', { className: 'code' }, t);
      }
      function T() {
        return l.a.createElement(
          l.a.Fragment,
          null,
          l.a.createElement(d, { title: 'Upcoming features' }),
          l.a.createElement(
            'p',
            null,
            "I'm still working on making this awesome. Here's some of the things I'm going to be adding next:"
          ),
          l.a.createElement(
            'ul',
            null,
            l.a.createElement(
              'li',
              null,
              'Delays - Allow you to simulate a slow system, by delaying responses'
            ),
            l.a.createElement(
              'li',
              null,
              'Codegen - A button on the UI that allows you to export a manually created stub to config'
            ),
            l.a.createElement(
              'li',
              null,
              'Wizards - An even easier way to create stubs and more by pointing Stub4 at Swagger/OpenApi documentation'
            ),
            l.a.createElement(
              'li',
              null,
              'Contracts - Actually already partially working but undocumented, the possibility to generate pact contracts from stubs definitions, to ensure they are realistic'
            )
          )
        );
      }
      a(29);
      function x(e) {
        var t = e.children;
        return l.a.createElement(
          'div',
          { className: 'docsBody' },
          l.a.createElement(
            'div',
            null,
            t,
            l.a.createElement('h1', { className: 'docsTitle' }, 'Welcome to the Docs!')
          ),
          l.a.createElement(
            'div',
            { className: 'docsContent' },
            l.a.createElement(
              'div',
              { className: 'column' },
              l.a.createElement(
                u,
                null,
                l.a.createElement(i, { label: 'Motivation', path: '/docs/why' }),
                l.a.createElement(i, { label: 'How it works', path: '/docs/what' }),
                l.a.createElement(i, { label: 'How to use it', path: '/docs/how' }),
                l.a.createElement(m, {
                  label: 'How to stub',
                  path: '/docs/how/stubs',
                  parentPath: '/docs/how'
                }),
                l.a.createElement(i, { label: 'Next', path: '/docs/next' })
              )
            ),
            l.a.createElement(
              'div',
              { className: 'centerColumn' },
              l.a.createElement(
                h,
                null,
                l.a.createElement(c.b, { path: '/docs/why', component: p }),
                l.a.createElement(c.b, { path: '/docs/what', component: y }),
                l.a.createElement(c.b, { path: '/docs/how/stubs', component: b }),
                l.a.createElement(c.b, { path: '/docs/how', component: E }),
                l.a.createElement(c.b, { path: '/docs/next', component: T }),
                l.a.createElement(c.a, { to: '/docs/why' })
              )
            )
          )
        );
      }
      a(30);
      s.a.render(
        l.a.createElement(function() {
          return l.a.createElement(
            r.a,
            null,
            l.a.createElement(
              c.d,
              null,
              l.a.createElement(c.b, { path: '/docs' }, l.a.createElement(x, null)),
              l.a.createElement(c.a, { to: '/docs' })
            )
          );
        }, null),
        document.getElementById('root')
      );
    }
  },
  [[17, 1, 2]]
]);
//# sourceMappingURL=main.f89faaaa.chunk.js.map
