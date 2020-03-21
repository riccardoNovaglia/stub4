import React from 'react';
import { Code, InlineCode, SectionTitle } from '../../DocsBits';

function Stubs() {
  const stub = {
    requestMatcher: {
      url: '/some-url',
      method: 'POST',
      body: { bodyMatch: { id: 321 } }
    },
    response: { body: { mgs: 'User 321 created' }, type: 'json' }
  };

  return (
    <>
      <SectionTitle title="Stubs" />
      <p>
        If you want to simulate an HTTP request-response setup, a stub is a great start. You define
        how to match a given request, and setup a canned response that will be returned.
      </p>
      <p>A complete stub definition will look a bit like this:</p>
      <Code>{stub}</Code>

      {/* TODO: move this to its own section */}
      <RequestMatching />

      <StubResponseDefinition />
    </>
  );
}

function StubResponseDefinition() {
  return (
    <>
      <h3>Response definition</h3>
      <p>
        A stub response is defined by a <InlineCode>statusCode</InlineCode>,{' '}
        <InlineCode>type</InlineCode>, and <InlineCode>body</InlineCode>. Here's an example:
      </p>
      <Code>
        {{
          statusCode: 201,
          type: 'application/json',
          body: { message: 'Item created successfully', itemId: '321' }
        }}
      </Code>
      <p>
        At the moment all properties are optional, but the <InlineCode>response</InlineCode> section
        needs to be added (this might well change in the future). All properties have default
        values: <InlineCode>statusCode</InlineCode> defaults to <InlineCode>200</InlineCode>,{' '}
        <InlineCode>type</InlineCode> defaults to <InlineCode>application/json</InlineCode>, and{' '}
        <InlineCode>body</InlineCode> defaults to <InlineCode>{'{}'}</InlineCode>
      </p>
    </>
  );
}

function RequestMatching() {
  return (
    <>
      <h3>Request Matching</h3>
      <p>
        The request matcher in a stub must contain at minimum a <InlineCode>url</InlineCode>. If the
        request received matches the url exactly, the response is sent back.
      </p>
      <p>
        The method matcher and the body matcher are both optional and are going to be compared on
        top of the url matching. If you want to explicitly match any method, you can use{' '}
        <InlineCode>method: '*'</InlineCode>. This is equivalent to omitting the method matcher.{' '}
        <br />
        As the name suggests, the method matcher ensures the method on the request matches the given
        value. By default any method is accepted and will return a successful response.
      </p>
      <p>
        The body matcher will match the contents of the request received. A body matcher can be used
        for json, as well as xml content. <br />
        For json, <InlineCode>body</InlineCode> will contain a <InlineCode>bodyMatch</InlineCode>,
        that will compare key-value pairs. <br />
        For xml, you'll need to add <InlineCode>type: 'xml'</InlineCode>, and a list of{' '}
        <InlineCode>path</InlineCode> and <InlineCode>value</InlineCode> pairs. The paths are{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/XPath" className="linkToOtherDocs">
          xPath
        </a>{' '}
        expressions that will be executed agains the request body received. Their output is then
        compared to the value provided.
        <br />
        Here's an example:{' '}
      </p>
      <Code>
        {{
          requestMatcher: {
            method: 'POST',
            url: '/body-match-xml',
            body: {
              type: 'xml',
              bodyMatch: [{ path: 'string(//author)', value: 'somebody' }]
            }
          }
        }}
      </Code>
    </>
  );
}

export { Stubs };
