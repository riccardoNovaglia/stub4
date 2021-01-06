import { render as rtlRender, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CopyToClipboardButton } from './CopyToClipboard';

it('renders the button', () => {
  const { copyButton } = renderButton();

  expect(copyButton).toBeInTheDocument();
});

it('renders the successful copied message after copying', async () => {
  const { copyButton } = renderButton();

  userEvent.click(copyButton);

  await waitFor(() => {
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });
});

it('copies the given item definition as a string to the clipboard', async () => {
  renderButton({ some: 'definition' });

  await expectDefinitionToCopyToClipboard('{"some":"definition"}');
});

function renderButton(itemDefinition = {}) {
  rtlRender(<CopyToClipboardButton itemDefinition={itemDefinition} />);

  return {
    copyButton: screen.getByText('Copy definition to Clipboard')
  };
}

export async function expectDefinitionToCopyToClipboard(itemDefinitionString) {
  userEvent.click(screen.getByText('Copy definition to Clipboard'));

  await waitFor(() => {
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(itemDefinitionString);
  });
}
