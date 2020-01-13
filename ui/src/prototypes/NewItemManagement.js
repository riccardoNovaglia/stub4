import { useState } from 'react';

export function useObject(key, initialValue) {
  const [value, set] = useState(initialValue);
  return {
    [key]: {
      value,
      set
    }
  };
}

export function updatableItem(data, setItemFn) {
  return {
    ...data,
    updateFromValue(setFn, key, value) {
      setFn(value);
      const updatedStateSnapshot = {
        ...this,
        [key]: { value }
      };
      setItemFn(updatedStateSnapshot);
    },
    updateFromEvent(setFn, key, event) {
      this.updateFromValue(setFn, key, event.target.value);
    }
  };
}

export function updatableItem2(data) {
  return {
    ...data,
    updateFromValue(setFn, _key, value) {
      setFn(value);
    },
    updateFromEvent(setFn, key, event) {
      this.updateFromValue(setFn, key, event.target.value);
    }
  };
}
