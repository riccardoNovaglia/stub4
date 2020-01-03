import _ from 'lodash';
import React from 'react';

export default function ItemsList({
  items,
  selected,
  setSelected,
  styles,
  itemKey,
  selectionMatch,
  children
}) {
  const className = (selected, item) =>
    selected && selectionMatch(selected, item) ? `${styles.itemClass} selected` : styles.itemClass;

  return (
    <div className={styles.listClass}>
      {_.isEmpty(items) && <p className="noResultsMsg">None created yet</p>}
      {items.map(item => (
        <div
          key={itemKey(item)}
          className={className(selected, item)}
          onClick={() => setSelected(item)}
        >
          {children.item(item)}
        </div>
      ))}
    </div>
  );
}
