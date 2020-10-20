import React from 'react';
import { Code, InlineCode as IC, Link, SectionTitle } from '../../DocsBits';

export function RequestMatcher() {
  return (
    <>
      <SectionTitle title="The Request Matcher" />
      <h4>URL</h4>
      <p>
        The request matcher in a stub must contain at minimum a <IC>url</IC>. If the request
        received matches the url exactly, the response is sent back. <br />
        You can also use <IC>*</IC> to match only the start, or end, of a URL. For example{' '}
        <IC>/the start/*</IC> or <IC>*/the-end</IC>
      </p>
      <h4>Method</h4>
      <p>
        The method matcher and the body matcher are both optional and are going to be compared on
        top of the url matching. If you want to explicitly match any method, you can use{' '}
        <IC>method: '*'</IC>. This is equivalent to omitting the method matcher. <br />
        As the name suggests, the method matcher ensures the method on the request matches the given
        value. By default any method is accepted and will return a successful response.
      </p>
      <h4>Body</h4>
      <p>
        The body matcher will match the contents of the request received. A body matcher can be used
        for json, as well as xml content. <br />
        For json, <IC>body</IC> will contain a <IC>bodyMatch</IC>, that will compare key-value
        pairs. <br />
        For xml, you'll need to add <IC>type: 'xml'</IC>, and a list of <IC>path</IC> and{' '}
        <IC>value</IC> pairs. The paths are{' '}
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

export function RequestMatcherMoreInfoLink() {
  return (
    <>
      <p>
        For more information on the request matcher,{' '}
        <Link to="/stub4/docs/how/requestMatcher">check its documentation page</Link>
      </p>
    </>
  );
}
