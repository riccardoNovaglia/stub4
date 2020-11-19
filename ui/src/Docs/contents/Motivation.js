import { SectionTitle } from '../DocsBits';
import screenshot from './stub4.jpg';

export function Motivation() {
  return (
    <>
      <SectionTitle title="Motivation" />

      <p>When building an app or website, tests are your best friends.</p>
      <p>But sometimes, it's useful to just start the thing and see it working.</p>
      <p>
        Stub4 is an HTTP stub server that allows you to explore your app behaviour under a variety
        of scenarios. You can use Stub4 to easily verify success and failure cases, fast and slow
        systems, stateless and stateful interactions.
      </p>
      <p>
        You can conveniently setup Stub4 programmatically via its HTTP API, via JSON config files,
        programmatically through javascript, and via its web UI. You can easily start it as a
        standalone process or during your tests. You can configure it while it's running via HTTP
        requests, its javascript client, and its UI.
      </p>
      <p>Use it for prototyping, testing, demonstrating, and more.</p>
      <img className="screenshot" src={screenshot} alt="A screenshot of the Stub4 Web UI" />
    </>
  );
}

export const motivationPath = '/stub4/docs/motivation';
