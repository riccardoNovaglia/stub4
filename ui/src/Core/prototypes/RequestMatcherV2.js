import React from 'react';

import { UrlMatcher } from '../prototypes/Url';
import { HeadersMatcher } from './HeadersMatcher';
import { BodyMatcher } from './BodyMatcher';
import { MethodMatcher } from './MethodMatcher';

export function RequestMatcherV2({ requestMatcher, setRequestMatcher }) {
  return (
    <div className="requestMatching">
      <label htmlFor="requestDefinitionForm">Request Matching</label>
      <form id="requestDefinitionForm" onSubmit={(event) => event.preventDefault()}>
        <div>
          <UrlMatcher
            urlMatcher={requestMatcher.url}
            onChange={(url) => setRequestMatcher({ ...requestMatcher, url })}
          />
        </div>
        <div>
          <MethodMatcher
            methodMatcher={requestMatcher.method}
            onChange={(method) => setRequestMatcher({ ...requestMatcher, method })}
          />
        </div>
        <div>
          <HeadersMatcher
            headersMatcher={requestMatcher.headers}
            onChange={(headers) => setRequestMatcher({ ...requestMatcher, headers })}
          />
        </div>
        <div>
          <BodyMatcher
            bodyMatcher={requestMatcher.body}
            onChange={(body) => setRequestMatcher({ ...requestMatcher, body })}
          />
        </div>
      </form>
    </div>
  );
}
