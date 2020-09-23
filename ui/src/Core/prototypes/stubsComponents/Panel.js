import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import './Panel.scss';

export function Panel({ itemsLifecycle, presentation, children }) {
  const history = useHistory();
  const location = useLocation();

  const [items, setItems] = useState([]);

  const { fetch, clear } = itemsLifecycle;
  const { label, icon, className } = presentation;

  useEffect(() => {
    if (!location.pathname.includes('/edit') && !location.pathname.includes('/new')) {
      fetch(setItems);
    }
  }, [fetch, setItems, location]);

  const createNew = () => {
    history.push(`/stub4/${label}/new`.toLowerCase());
  };

  const onClear = async () => {
    await clear();
    await fetch(setItems);
  };

  return (
    <div className="panel">
      <h1>
        {label}
        <i className="material-icons">{icon}</i>
        <button className="createBtn" onClick={createNew}>
          <i className="material-icons">add_box</i>Create
        </button>
        <button className="clearBtn" onClick={onClear}>
          <i className="material-icons">clear_all</i>Clear
        </button>
      </h1>
      <div className={className}>{children.list(items)}</div>
    </div>
  );
}
