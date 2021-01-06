import { RequestMatcherMoreInfoLink } from './RequestMatcher';
import { Code, InlineCode, SectionTitle } from '../../DocsBits';

export function Stubs() {
  const stub = {
    requestMatcher: { url: '/some-url' },
    response: { body: { mgs: 'User 321 created' }, contentType: 'application/json' }
  };

  return (
    <>
      <SectionTitle title="Stubs" />
      <p>
        If you want to simulate an HTTP request-response setup, a stub is a great start. You define{' '}
        how to match a request, and setup a canned response that will be returned.
      </p>
      <p>A complete stub definition will look a bit like this:</p>
      <Code>{stub}</Code>

      <RequestMatcherMoreInfoLink />

      <StubResponseDefinition />
    </>
  );
}

function StubResponseDefinition() {
  return (
    <>
      <h3>Response definition</h3>
      <p>A stub response definition can contain:</p>{' '}
      <ul>
        <li>
          <InlineCode>statusCode</InlineCode> - defaults to <InlineCode>200</InlineCode>
        </li>
        <li>
          <InlineCode>contentType</InlineCode> - defaults to{' '}
          <InlineCode>application/json</InlineCode>
        </li>
        <li>
          <InlineCode>body</InlineCode> - defaults to <InlineCode>{'{}'}</InlineCode>
        </li>
        <li>
          <InlineCode>delay</InlineCode> - defaults to <InlineCode>0</InlineCode>. Defined in
          milliseconds
        </li>
      </ul>
      <p>Here's an example:</p>
      <Code>
        {{
          statusCode: 201,
          contentType: 'application/json',
          body: { message: 'Item created successfully', itemId: '321' },
          delay: 1000
        }}
      </Code>
      <p>
        At the moment all properties are optional and will be defaulted as described above, but the{' '}
        <InlineCode>response</InlineCode> section needs to be added (this might well change in the
        future)
      </p>
    </>
  );
}
export const stubsPath = '/stub4/docs/how/stubs';
