import isEmpty from 'lodash.isempty';
import './Lists.scss';

// TODO: rename setSelected to onSelected
export default function ItemsList({ items, setSelected, styles, itemKey, children }) {
  const className = (item) => (!item.enabled ? `${styles.itemClass} disabled` : styles.itemClass);

  return (
    <div className={styles.listClass}>
      {isEmpty(items) && <p className="noResultsMsg">None created yet</p>}
      {items.map((item) => (
        <div key={itemKey(item)} className={className(item)} onClick={() => setSelected(item)}>
          {children.item(item)}
        </div>
      ))}
    </div>
  );
}
