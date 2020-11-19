import { InlineCode, SectionTitle, Link } from '../DocsBits';
import { configPath } from './How/Config';

export function How() {
  return (
    <>
      <SectionTitle title="How to use Stub4" />
      <p>
        There's three ways to setup stubbings in Stub4: the web interface, configuration files, and
        the test client.
      </p>
      <h3>The Web Interface</h3>
      <p>
        By default, when you start Stub4, it opens up two ports on the network: one for managing and
        using fakes, and one that will serve you a web interface, that you can use to see its
        current state and add new fakes. <br />
        On this page you'll be able to see the current stubbings you have created, as well as create
        new ones. You'll also see any request that didn't match any stubbing setup, and create a new
        stub from that.
      </p>
      <h3>Programmatically, and with Config Files</h3>
      <p>
        You can start Stub4 and configure it directly in a javascript file. Alternatively, you start
        Stub4 via the CLI, and can point it at a JSON config file. This can be useful to setup some
        source-controlled defaults that you'll need every time you start Stub4, while still being
        able to add more after it started.
        <br />
        You can find more info about how you can configure Stub4 <Link to={configPath}>here</Link>.
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

export const howPath = '/stub4/docs/how/';
