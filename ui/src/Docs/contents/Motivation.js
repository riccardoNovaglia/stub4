import React from 'react';
import { SectionTitle } from './SectionTitle';

function Motivation() {
  return (
    <>
      <SectionTitle title="Why" />

      <p>When building an app or website, tests are your best friends.</p>
      <p>But sometimes, it's just useful to start the thing and see it working.</p>
      <p>
        In these cases, you can either point your app at the real system you're integrating with and
        hope for the best, or you can use Stub4 to simulate it.
      </p>
      <p>
        Stub4 allows you to explore your app's behaviour without connecting it to a real live
        system, and because you have full control, verify what happens in situations that would be
        hard to encounter in real life.
      </p>
      <p>You can use if prototyping, testing, demonstrating, and more</p>
    </>
  );
}

export { Motivation };
