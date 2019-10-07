import _ from 'lodash';
import React from 'react';

export function CrudsList({ cruds, selected, setSelected }) {
  return (
    <div className="crudsList">
      {_.isEmpty(cruds) ? (
        <p className="noResultsMsg">No cruds have been created yet</p>
      ) : (
        cruds.map(crud => (
          <div key={`${crud.url}-item`} className="crud" onClick={() => setSelected(crud)}>
            <p className={selected && selected.url === crud.url ? 'selected crudDef' : 'crudDef'}>
              <span className="url">{crud.url}</span>
              <span>→</span>
              <span className="id">{crud.idAlias}</span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
