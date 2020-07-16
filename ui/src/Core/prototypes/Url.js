import React from 'react';

export function Url({ url, handle, label = 'URL', focus = true }) {
  function handleWithLeadingSlash(event) {
    handle(
      event.target.value.length > 0 && event.target.value[0] !== '/'
        ? `/${event.target.value}`
        : event.target.value
    );
  }

  return (
    <div>
      <label className="itemLabel" htmlFor="url">
        {label}
      </label>
      <input
        id="url"
        type="text"
        onChange={handleWithLeadingSlash}
        value={url.value}
        autoFocus={focus}
      />
    </div>
  );
}

export function UrlMatcher({ urlMatcher, onChange, label = 'URL', focus = true }) {
  function handleWithLeadingSlash(event) {
    const text = event.target.value[0] !== '/' ? `/${event.target.value}` : event.target.value;
    onChange(text);
  }

  return (
    <div>
      <label className="itemLabel" htmlFor="url">
        {label}
      </label>
      <input
        id="url"
        type="text"
        onChange={handleWithLeadingSlash}
        value={urlMatcher}
        autoFocus={focus}
      />
    </div>
  );
}
