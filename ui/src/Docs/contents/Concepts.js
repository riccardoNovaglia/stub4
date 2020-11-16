import React from 'react';
import { SectionTitle, Link, ExternalLink } from '../DocsBits';
import { stubsPath } from './How/Stubs';
import { scenariosPath } from './How/Scenarios';
import { crudsPath } from './How/Cruds';
import { proxyPath } from './How/Proxy';

export function Concepts() {
  return (
    <>
      <SectionTitle title="Concepts" />
      <p>
        Stub4 offers a few different types of stubbings, which give you all the tools you need to
        setup your application. You might not need all, so pick whatever fits your requirements.
        <br />
        <span className="someday">
          Some beautiful day, maybe, these different types of stubbings will be like plugins, and
          you'll be able to pick and choose whatever you need. Want GraphQL stubbings without having
          to set them up manually? Just import the right plugin! Someday... Want to get involved?{' '}
          <ExternalLink to="mailto:stub4js@gmail.com">Let me know</ExternalLink>
        </span>
      </p>
      <h3>Stubs</h3>
      <p>
        The most straightforward tool Stub4 offers to simulate a real system is a{' '}
        <span className="highlightedTerm">stub</span>. A stub is a simple request-response setup.
        Given a request matching some parameters, a pre-configured response is returned.
      </p>
      <p>
        You can find how to create and use a stub <Link to={stubsPath}>here</Link>
      </p>
      <p>But that's not all.</p>
      <h3>Scenarios</h3>
      <p>
        Often, you'll want to simulate a variety of scenarios for the same HTTP call, with different
        outcomes based on the request sent. To do this, you can use{' '}
        <span className="highlightedTerm">scenarios</span>. Scenarios are similar to stubs, but
        simplify the process of setting up different responses based on the parameters of the
        request. You can even setup default values, and only override what you need in a given
        outcome.
      </p>
      <p>
        You can find how to create and use scenarios <Link to={scenariosPath}>here</Link>
      </p>
      <h3>Cruds</h3>
      <p>
        Another common use case is to simulate straightforward CRUD (Create Read Update Delete)
        applications that follow REST conventions. For that you'll want to use a{' '}
        <span className="highlightedTerm">crud</span>, which creates an in-memory database that you
        can add and remove things from via HTTP calls.
      </p>
      <p>
        You can find how to create and use cruds <Link to={crudsPath}>here</Link>
      </p>
      <h3>Proxy</h3>
      <p>
        In some cases, you might just want to let the traffic reach your downstream systems instead
        of stubbing it. For that, you can use a <span className="highlightedTerm">proxy</span>. As
        the name suggests, all requests hitting a proxy will be forwarded over to a configured
        target, and responses then relied back to your app.
        <br />
        This can be useful if you want to simulate your system only in some situations or for
        specific cases.
      </p>
      <p>
        You can find how to create and use a proxy <Link to={proxyPath}>here</Link>
      </p>
    </>
  );
}

export const conceptsPath = '/stub4/docs/concepts';
