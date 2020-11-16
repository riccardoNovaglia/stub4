import React from 'react';
import { Code, InlineCode, SectionTitle } from '../../DocsBits';

export function Cruds() {
  const crud = {
    requestMatcher: { url: '/some-url' },
    crud: { idAlias: 'personId', patchOnPost: true, data: [{ personId: 321, name: 'jimbo' }] }
  };

  return (
    <>
      <SectionTitle title="Cruds" />
      <p>
        If you want to simulate a REST-like resource repository, and be able to Create, Read,
        Update, Delete, what you want is a CRUD. You just need to define the URL you want, some
        initial data if you need some.
      </p>
      <p>A complete crud definition will look a bit like this:</p>
      <Code>{crud}</Code>

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
        The only part you need in a crud request matcher is the <InlineCode>url</InlineCode>. Stub4
        will create an in-memory collection from which you can get items by ID, delete, update and
        so forth. <br />
        For example, a crud created with id <InlineCode>/some-url</InlineCode> and containing an
        object with id <InlineCode>321</InlineCode> will return the item when called with{' '}
        <InlineCode>/some-url/321</InlineCode>. You can delete it with a DELETE call, update it with
        PATCH, and so on.
      </p>
    </>
  );
}

function ResponseDefinition() {
  return (
    <>
      <h3>Crud options</h3>
      <p>
        On top of allowing you to create a crud with some pre-define data, you can also change the
        primary key of the items you create and retrieve. By default the key name is{' '}
        <InlineCode>id</InlineCode>, but you can change it setting <InlineCode>idAlias</InlineCode>
        <br />
        For example, take the following crud definition:
      </p>
      <Code>
        {{
          requestMatcher: { url: '/customers' },
          crud: {
            data: [{ id: 321, username: 'jbo', name: 'jimbo' }]
          }
        }}
      </Code>
      <p>
        Because we have not defined a custom <InlineCode>idAlias</InlineCode>, you'll get Jimbo's
        record from the crud with a call to <InlineCode>/customers/321</InlineCode>.<br />
        If you instead wanted to retrieve records using <InlineCode>username</InlineCode> as the
        key, you would change the crud definition like so:
      </p>
      <Code>
        {{
          requestMatcher: { url: '/customers' },
          crud: {
            idAlias: 'username',
            data: [{ id: 321, username: 'jbo', name: 'jimbo' }]
          }
        }}
      </Code>
      <p>
        Now your call to <InlineCode>/customers/321</InlineCode> will return a 404. To get Jimbo's
        record you'll need to use <InlineCode>/customers/jbo</InlineCode>.
      </p>
      <p>
        Finally, <InlineCode>patchOnPost</InlineCode> makes it such that when you post a record with
        an id that already existed, instead of entirely overwriting the record, it will update the
        properties you have sent.
      </p>
      <h4>Note</h4>
      <p>Query parameters for searching and sorting are not yet supported, but will be soon.</p>
    </>
  );
}

export const crudsPath = '/stub4/docs/how/cruds';
