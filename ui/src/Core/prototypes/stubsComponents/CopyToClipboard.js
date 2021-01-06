import { useState } from 'react';

export function CopyToClipboardButton({ itemDefinition }) {
  const [copied, setCopied] = useState(false);

  async function copyItemToClipboard() {
    await navigator.clipboard.writeText(JSON.stringify(itemDefinition));
    setCopied(true);
  }

  return (
    <div>
      <button
        onClick={async (e) => {
          e.preventDefault();
          await copyItemToClipboard();
        }}
        className="copyToClipboardButton"
      >
        <i className="material-icons">content_paste</i>Copy definition to Clipboard
      </button>
      {copied && <p className="copiedLabel">Copied!</p>}
    </div>
  );
}
