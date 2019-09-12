import _ from 'lodash';
import React from 'react';

import './DBsList.scss';

export function DBsList({ dbs, selected, setSelected }) {
  return (
    <div className="dbsList">
      {_.isEmpty(dbs) ? (
        <p className="noDbsMsg">No dbs have been created yet</p>
      ) : (
        dbs.map(db => (
          <div key={`${db.url}-item`} className="db" onClick={() => setSelected(db)}>
            <p className={selected && selected.url === db.url ? 'selectedDbDef' : 'dbDef'}>
              <span className="url">{db.url}</span>
              <span>→</span>
              <span className="id">{db.idAlias}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
