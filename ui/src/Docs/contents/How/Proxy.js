import React from 'react';
import { Code, InlineCode, SectionTitle } from '../../DocsBits';

export function Proxy() {
  const proxy = {
    requestMatcher: { url: '/some-url' },
    proxy: { destination: { url: '/some-other-url' } }
  };

  return (
    <>
      <SectionTitle title="Proxy" />
      <p>
        There are cases where you might want to swap from simulating a service, to just letting your
        app call it. You can either change the configuration of your app, and point it where you
        need, and restart it, or you can let your app call Stub4, and have it proxy the request over
        to any destination. <br />
        With this, you can easily swap out calling the real thing for a stub at any time you need,
        without your app ever knowing the difference. <br />
        (In the future, Stub4 will offer more elaborate controls over its proxy, to allow you to
        only proxy calls that match specific parameters, to transform requests before sending them
        back to your app, or introducing faults such as delaying responses for some time.) <br />
        Here's an example of a proxy:
      </p>
      <Code>{proxy}</Code>

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
        The request matcher in a proxy must contain at minimum a <InlineCode>url</InlineCode>. If
        the request received matches the url exactly, the response is sent back.
      </p>
      <p>
        You can add an optional <InlineCode>method</InlineCode> matcher, which will default to{' '}
        <InlineCode>GET</InlineCode>. Body matching will be supported soon.
      </p>
    </>
  );
}

function ResponseDefinition() {
  return (
    <>
      <h3>The destination</h3>
      <p>
        A proxy currently only allows defining a <InlineCode>destination</InlineCode> and its{' '}
        <InlineCode>url</InlineCode>. When a request is matched, it will be proxied over to the
        destination given, and the response sent back.
      </p>
    </>
  );
}

export const proxyPath = '/stub4/docs/how/proxy';
