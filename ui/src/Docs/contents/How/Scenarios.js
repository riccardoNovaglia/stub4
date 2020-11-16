import React from 'react';
import { Code, InlineCode, SectionTitle, CodeSnippet } from '../../DocsBits';

export function Scenarios() {
  const scenarios = {
    requestMatcher: { url: '/greet/person/{name}' },
    outcomes: [
      { match: { name: 'jimmy' }, response: { body: { greeting: 'Hello from Jimmy' } } },
      { match: { name: 'janny' }, response: { body: { greeting: 'Hello from Janny' } } },
      {
        match: { name: 'mystery' },
        response: { body: { greeting: 'mystery guest not found' }, statusCode: 404 }
      }
    ],
    default: {
      response: {
        body: { greeting: "You're going to need to provide a name", source: 'greetings' },
        statusCode: 400
      }
    }
  };

  return (
    <>
      <SectionTitle title="Scenarios" />
      <p>
        Stubs are useful and convenient for stubbing a single request-response setup, but often
        you'll find yourself needing to setup slight variations of the same response, based on
        slightly different request parameters. That's where scenarios can be useful. <br />
        Setting up scenarios is made up of three parts: define how to match requests, define a
        default response if you need one, and then define as many outcomes as needed, based on the
        parameters of requests. <br />
        Here's an example of a full scenario:
      </p>
      <Code>{scenarios}</Code>

      <RequestMatching />

      <ResponseDefinition />
    </>
  );
}

function RequestMatching() {
  return (
    <>
      <h3>Request Matching</h3>
      <p>
        The key part of a scenario request matcher is the <InlineCode>url</InlineCode>. This can be
        an exact match of your requests' url if you want to match on the request body, or you can
        include variable names in <InlineCode>{'{}'}</InlineCode> and reference them in outcomes to
        match the correct one.
        <br />
        For example, given this url <InlineCode>{'/some-url/{variableName}'}</InlineCode>, and these
        outcomes
      </p>
      <CodeSnippet indentation={1}>
        [<br />
        {"  { match: { variableName: 'option1' }, response: { statusCode: 200 } }"}
        <br />
        {"  { match: { variableName: 'option2' }, response: { statusCode: 201 } }"}
        <br />]
      </CodeSnippet>
      <p>
        requests to <InlineCode>{'/some-url/option1'}</InlineCode> will get back a{' '}
        <InlineCode>200</InlineCode>, where calls to <InlineCode>{'/some-url/option2'}</InlineCode>{' '}
        will get back a <InlineCode>201</InlineCode>.
      </p>
      <p>
        You can also match on requests body; given this url <InlineCode>{'/some-url'}</InlineCode>,
        and the previous outcomes, requests with body which include{' '}
        <InlineCode>{'{"variableName": "option1"}'}</InlineCode> will get a{' '}
        <InlineCode>200</InlineCode>, requests with body{' '}
        <InlineCode>{'{"variableName": "option2"}'}</InlineCode> will get{' '}
        <InlineCode>201</InlineCode>.
      </p>
    </>
  );
}

function ResponseDefinition() {
  return (
    <>
      <h3>Outcomes and default</h3>
      <p>
        Each outcome in a scenario should contain a <InlineCode>match</InlineCode> block, which is
        used to determine whether the corresponding response should be sent back. This object should
        be a simple json object, and stub4 will match each key/value pair against either values from
        the url matcher, or the body received. <br />
        The response object can contain a <InlineCode>statusCode</InlineCode>, and{' '}
        <InlineCode>body</InlineCode>. <br />
        If many of your outcomes have a common <InlineCode>statusCode</InlineCode> or{' '}
        <InlineCode>body</InlineCode>, you can set this values in the{' '}
        <InlineCode>default.response</InlineCode>, and only override what you need where
        appropriate.
      </p>
    </>
  );
}

export const scenariosPath = '/stub4/docs/how/scenarios';
