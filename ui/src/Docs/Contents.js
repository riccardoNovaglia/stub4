import { Switch } from 'react-router-dom';

import './Contents.scss';

function Contents({ children }) {
  return <Switch>{children}</Switch>;
}

export { Contents };
