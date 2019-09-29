import _ from 'lodash';
import React, { useState } from 'react';

import { stub, request } from './StubClient';
import { createCrud } from './CrudClient';

import { Stub } from './Stub';
import { Crud } from './Crud';

import './New.scss';

export function New({ afterSuccessfulCreation, building, onBuilding, onEscape, hooky }) {
  const setup = async () => {
    hooky.stubType.value === 'stub'
      ? await stub(
          request(hooky.stub.method.value, hooky.stub.url.value).returns(
            hooky.stub.type.value,
            hooky.stub.body.value,
            hooky.stub.status.value
          )
        )
      : await createCrud(hooky.crud.url.value, hooky.crud.idAlias.value);

    afterSuccessfulCreation();
  };

  const handle = setFn => event => setFn(event.target.value);
  const close = () => {
    hooky.clear();
    onEscape();
  };

  return (
    <>
      <button className="newButton" onClick={onBuilding}>
        New
      </button>
      {building && (
        <>
          <div className="new" onKeyDown={e => e.keyCode === 27 && close()}>
            <button onClick={setup}>Save</button>
            <button onClick={close}>Close</button>

            <select value={hooky.stubType.value} onChange={handle(hooky.stubType.set)}>
              <option value="stub">stub</option>
              <option value="crud">crud</option>
            </select>

            {hooky.stubType.value === 'stub' ? (
              <Stub stub={hooky.stub} handle={handle} />
            ) : (
              <Crud crud={hooky.crud} handle={handle} />
            )}
          </div>
          <div className="overlay" />
        </>
      )}
    </>
  );
}

export function defaults(starter) {
  const starterType = _.get(starter, 'type', 'none');
  const defaultValues = {
    starterType: 'stub',
    initialUrl: '',
    initialIdAlias: '',
    initialMethod: 'GET',
    initialStatus: 200,
    initialBody: '{}',
    initialType: 'json'
  };
  switch (starterType) {
    case 'none':
      return defaultValues;
    case 'unmatched':
      return {
        ...defaultValues,
        initialUrl: _.get(starter, 'request.url', ''),
        initialMethod: _.get(starter, 'request.method', 'GET')
      };
    case 'stub':
      return {
        ...defaultValues,
        initialUrl: _.get(starter, 'stub.request.url', ''),
        initialMethod: _.get(starter, 'stub.request.method', 'GET'),
        initialStatus: _.get(starter, 'stub.response.statusCode', 200),
        initialBody: _.get(starter, 'stub.response.body', '{}'),
        initialType: _.get(starter, 'stub.response.type', 'json')
      };
    default:
      return defaultValues;
  }
}

export function useHooky() {
  const stub = {
    ...useObject('url', ''),
    ...useObject('method', 'GET'),
    ...useObject('status', 200),
    ...useObject('body', '{}'),
    ...useObject('type', 'json')
  };
  const crud = {
    ...useObject('url', ''),
    ...useObject('idAlias', '')
  };
  const hooky = {
    ...useObject('stubType', 'stub'),
    stub,
    crud,
    clear() {
      stub.url.set('');
      stub.status.set(200);
      stub.body.set('{}');
      stub.method.set('GET');
      stub.type.set('json');
      crud.url.set('');
      crud.idAlias.set('');
    },
    update(starter) {
      const defaultValues = defaults(starter);

      stub.url.set(defaultValues.initialUrl);
      stub.status.set(defaultValues.initialStatus);
      stub.body.set(defaultValues.initialBody);
      stub.method.set(defaultValues.initialMethod);
      stub.type.set(defaultValues.initialType);
      crud.url.set(defaultValues.initialUrl);
      crud.idAlias.set(defaultValues.initialIdAlias);
    }
  };

  return hooky;
}

function useObject(key, initialValue) {
  const [value, set] = useState(initialValue);
  return {
    [key]: {
      value,
      set
    }
  };
}
