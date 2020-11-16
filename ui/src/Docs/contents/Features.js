import React from 'react';
import { SectionTitle } from '../DocsBits';

export function Features() {
  return (
    <>
      <SectionTitle title="Features" />

      <h3>An Interface for everybody in the team</h3>
      <p>
        While many stub HTTP servers exist, they are generally only managed by developers, since
        they need to be setup via HTTP requests, or configured via files and redeployed. Stub4's UI
        allows anybody to see all setup stubbings, modify and add new, all while your app and Stub4
        are running. This is ideal for all those non-technical people in the team who might want to
        test particular scenarios, for running exploratory testing, for demonstrating and explaining
        behaviour to business folks.
      </p>
      <h3>Stubs can act as documentation</h3>
      <p>
        Making it easy to see all stubbings needed for a particular feature to work can also enable
        team members to quickly understand how an application works. By using the app and seeing
        request hitting Stub4 in real time, it becomes easy to understand what is happening behind a
        particular piece of functionality, and what systems an application interacts with.
      </p>
      <h3>Stubs can help analyse performance</h3>
      <p>
        Being able to count all request that hit Stub4 also enables anybody in the team to think
        about performance considerations. If a request is done many times over, its performance
        impact can be disproportionate. Making it easy to delay the stub's response, it's easy to
        understand the performance impact on user experience.
      </p>
      <h3>Hybrid proxy mode</h3>
      <p>
        Having proxy functionality built right into Stub4 means that you don't need to change your
        app's configuration to swap between stubs and real integrations. Just disable Stub4's
        responses in favour of proxying requests to the real system. You can even run a combination
        of both, allowing most requests to be proxied, except if they match given criteria. You can
        even delay proxied requests, to investigate what would happen if one of your downstream
        systems were to be slow, but without having to stub complex scenarios.
      </p>
      <h3>Run it as you need it</h3>
      <p>
        If you need a static stub HTTP server with preprogrammed responses, use JSON files to setup
        all your stubbings. <br />
        If you need to write a test for your HTTP client, start Stub4 right in your test, reset it
        in between tests, and stop it right after. <br />
        If you have lots of complex and dynamic mocks that could use with some data builders, set it
        up programmatically in javascript. <br />
        There's several ways to setup and interact with Stub4, to make sure it works in all
        situations, and for everybody in the team.
      </p>
    </>
  );
}

export const featuresPath = '/stub4/docs/features';
