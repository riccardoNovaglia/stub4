import React from 'react';

import './EnableDisableButton.scss';

export function EnableDisableButton({ id, enabled, setEnabled, toggleFunction }) {
  if (id === undefined) return null;

  async function toggle() {
    const { nowEnabled } = await toggleFunction(id, !enabled);
    setEnabled(nowEnabled);
  }

  return (
    <>
      <label className="enableDisable" htmlFor="enableDisable">
        Enabled
      </label>
      <input id="enableDisable" type="checkbox" checked={enabled} onChange={toggle} />
    </>
  );
}
