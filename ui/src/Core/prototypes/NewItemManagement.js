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

export function updatableItem(data) {
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

export function handle(item) {
  return function(setFn, key) {
    return function(event) {
      item.updateFromEvent(setFn, key, event);
    };
  };
}

export function handleValue(item) {
  return function(setFn, key) {
    return function(value) {
      item.updateFromValue(setFn, key, value);
    };
  };
}
