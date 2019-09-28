import React from 'react';

export function Url({ url }) {
  function handleWithLeadingSlash(setFn) {
    return event =>
      setFn(
        event.target.value.length > 0 && event.target.value[0] !== '/'
          ? `/${event.target.value}`
          : event.target.value
      );
  }

  return (
    <div>
      <label htmlFor="url">URL</label>
      <input
        id="url"
        type="text"
        onChange={handleWithLeadingSlash(url.set)}
        value={url.value}
        autoFocus
      />
    </div>
  );
}
