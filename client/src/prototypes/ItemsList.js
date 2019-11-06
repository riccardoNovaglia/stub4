import _ from 'lodash';
import React from 'react';

export default function ItemsList({
  items,
  selected,
  setSelected,
  itemComponent,
  styles,
  itemKey,
  selectionMatch
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
          onClick={() => {
            console.log('selecting', item);
            setSelected(item);
          }}
        >
          {itemComponent({ item })}
        </div>
      ))}
    </div>
  );
}
