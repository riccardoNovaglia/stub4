import { UrlMatcher } from './UrlMatcher';
import { HeadersMatcher } from './HeadersMatcher';
import { BodyMatcher } from './BodyMatcher';
import { MethodMatcher } from './MethodMatcher';

import './RequestMatcher.scss';

export function RequestMatcher({ requestMatcher, setRequestMatcher }) {
  return (
    <div className="requestMatching">
      <h3>Request Matching</h3>
      <fieldset id="requestDefinition" className="requestDefinition">
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
      </fieldset>
    </div>
  );
}
