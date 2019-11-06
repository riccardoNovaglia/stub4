import _ from 'lodash';
import React, { useState } from 'react';

import { Stub } from './Stub';
import { Crud } from './Crud';
import { Proxy } from './Proxy';

import './New.scss';

export function New({ afterSuccessfulCreation, building, onBuilding, onEscape, hooky, clients }) {
  const { stubClient, crudClient, proxyClient } = clients;

  const setup = async () => {
    hooky.starterType.starterType.value === 'stub'
      ? await stubClient.stub(
          stubClient
            .request(hooky.stub.method.value, hooky.stub.url.value)
            .returns(hooky.stub.type.value, hooky.stub.body.value, hooky.stub.status.value)
        )
      : hooky.starterType.starterType.value === 'crud'
      ? await crudClient.createCrud(hooky.crud.url.value, hooky.crud.idAlias.value)
      : await proxyClient.proxyRequests(hooky.proxy.url.value, hooky.proxy.proxyUrl.value);

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
        <span>
          <i className="material-icons">add_box</i>New
        </span>
      </button>
      {building && (
        <>
          <div className="new" onKeyDown={e => e.keyCode === 27 && close()}>
            <h1>
              Create new
              <div className="newSwitcher">
                <select
                  value={hooky.starterType.starterType.value}
                  onChange={handle(hooky.starterType.starterType.set)}
                >
                  <option value="stub">stub</option>
                  <option value="crud">crud</option>
                  <option value="proxy">proxy</option>
                </select>
              </div>
              <button onClick={close}>
                <i className="material-icons">clear</i>Close
              </button>
            </h1>
            <div>
              {hooky.starterType.starterType.value === 'stub' ? (
                <Stub stub={hooky.stub} handle={handle} />
              ) : hooky.starterType.starterType.value === 'crud' ? (
                <Crud crud={hooky.crud} handle={handle} />
              ) : (
                <Proxy proxy={hooky.proxy} handle={handle} />
              )}

              <div className="buttonGroup">
                <button onClick={setup}>
                  <i className="material-icons">playlist_add</i>Save
                </button>
              </div>
            </div>
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
    initialType: 'json',
    initialProxyUrl: ''
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
        starterType: 'stub',
        initialUrl: _.get(starter, 'stub.request.url', ''),
        initialMethod: _.get(starter, 'stub.request.method', 'GET'),
        initialStatus: _.get(starter, 'stub.response.statusCode', 200),
        initialBody: _.get(starter, 'stub.response.body', '{}'),
        initialType: _.get(starter, 'stub.response.type', 'json')
      };
    case 'proxy':
      return {
        ...defaultValues,
        starterType: 'proxy',
        initialUrl: _.get(starter, 'proxy.request.url', ''),
        initialProxyUrl: _.get(starter, 'proxy.proxyUrl', '')
      };
    default:
      return defaultValues;
  }
}

export function useHooky() {
  const starterType = useObject('starterType', 'stub');
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
  const proxy = {
    ...useObject('url', ''),
    ...useObject('proxyUrl', '')
  };
  const hooky = {
    starterType,
    stub,
    crud,
    proxy,
    clear() {
      stub.url.set('');
      stub.status.set(200);
      stub.body.set('{}');
      stub.method.set('GET');
      stub.type.set('json');
      crud.url.set('');
      crud.idAlias.set('');
      proxy.url.set('');
      proxy.proxyUrl.set('');
    },
    update(starter) {
      const defaultValues = defaults(starter);

      starterType.starterType.set(defaultValues.starterType);
      stub.url.set(defaultValues.initialUrl);
      stub.status.set(defaultValues.initialStatus);
      stub.body.set(defaultValues.initialBody);
      stub.method.set(defaultValues.initialMethod);
      stub.type.set(defaultValues.initialType);
      crud.url.set(defaultValues.initialUrl);
      crud.idAlias.set(defaultValues.initialIdAlias);
      proxy.url.set(defaultValues.initialUrl);
      proxy.proxyUrl.set(defaultValues.initialProxyUrl);
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
