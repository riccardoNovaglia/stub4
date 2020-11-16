import React from 'react';
import { SectionTitle } from '../DocsBits';

export function Next() {
  return (
    <>
      <SectionTitle title="Upcoming features" />

      <p>
        I'm still working on making this awesome. Here's some of the things I'm going to be adding
        next:
      </p>
      <ul>
        <li>
          Codegen - A button on the UI that allows you to export a manually created stub to config
        </li>
        <li>
          Wizards - An even easier way to create stubs and more by pointing Stub4 at Swagger/OpenApi
          documentation
        </li>
        <li>
          Contracts - Actually already partially working but undocumented, the possibility to
          generate pact contracts from stubs definitions, to ensure they are realistic
        </li>
      </ul>
    </>
  );
}

export const nextPath = '/stub4/docs/next';
