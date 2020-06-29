import React from 'react';

import { UrlMatcher } from '../prototypes/Url';
import { HeadersMatcher } from './HeadersMatcher';
import { BodyMatcher } from './BodyMatcher';
import { MethodMatcher } from './MethodMatcher';

export function RequestMatcherV2({ requestMatcher, setRequestMatcher }) {
  return (
    <div className="requestMatching">
      <h3>Request Matching</h3>
      <div>
        <UrlMatcher
          urlMatcher={requestMatcher.urlMatcher}
          onChange={(urlMatcher) => setRequestMatcher({ ...requestMatcher, urlMatcher })}
        />
      </div>
      <div>
        <MethodMatcher
          methodMatcher={requestMatcher.methodMatcher}
          onChange={(methodMatcher) => setRequestMatcher({ ...requestMatcher, methodMatcher })}
        />
      </div>
      <div>
        <HeadersMatcher
          headersMatcher={requestMatcher.headersMatcher}
          onChange={(headersMatcher) => setRequestMatcher({ ...requestMatcher, headersMatcher })}
        />
      </div>
      <div>
        <BodyMatcher
          bodyMatcher={requestMatcher.bodyMatcher}
          onChange={(bodyMatcher) => setRequestMatcher({ ...requestMatcher, bodyMatcher })}
        />
      </div>
    </div>
  );
}
