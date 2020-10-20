import React from 'react';
import { InlineCode, SectionTitle, Link } from '../DocsBits';
import { Stubs } from './How/Stubs';
import { Cruds } from './How/Cruds';
import { Scenarios } from './How/Scenarios';
import { Proxy } from './How/Proxy';
import { Config } from './How/Config';
import { RequestMatcher } from './How/RequestMatcher';

function How() {
  return (
    <>
      <SectionTitle title="How to use Stub4" />
      <p>
        There's three ways to setup fakes in Stub4: the web interface, configuration files, and the
        test client.
      </p>
      <h3>The Web Interface</h3>
      <p>
        By default, when you start Stub4, it opens up two ports on the network: one for managing and
        using fakes, and one that will serve you a web interface, that you can use to see its
        current state and add new fakes.
        {/* Picture */}
        On this page you'll be able to see the current fakes you have created, as well as create new
        ones. You'll also see any request that didn't match any fake, and create a new stub from
        that. <br />
        In the near distant future, you'll be able to create a new fake manually, and export it as
        JSON, ready to be dropped in a config file or created via the test client.
      </p>
      <h3>Programmatically, and with Config Files</h3>
      <p>
        You can start Stub4 and configure it directly in a javascript file. Alternatively, you start
        Stub4 via the CLI, and can point it at a JSON config file. Wit either options, you change
        its settings, and create any number of stubbings at startup. You'll still be able to add or
        remove any once it's up, but if you know you always need some setup, you can save it in
        files and keep it in your repo along with your app. <br />
        You can find more info about how you can configure Stub4{' '}
        <Link to="/stub4/docs/how/config">here</Link>.
      </p>
      <h3>The Test Client</h3>
      <p>
        Finally, you can start and configure Stub4 right in your tests. The Stub4 core library
        exports functions to start and stop it right from your test. Along with that, another
        library called <InlineCode>@stub4/client</InlineCode> allows you to setup your fakes with a
        DLS-like set of functions, that will help you explore what's available and give you type
        hints and autocomplete.
      </p>
    </>
  );
}

export { How, Stubs, Cruds, Scenarios, Proxy, Config, RequestMatcher };
