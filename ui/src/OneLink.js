import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const OneLink = ({ to, label, className }) => {
  return (
    <nav>
      {/* <ul className={className}> */}
      {/* <li> */}
      <Link to={to}>{label}</Link>
      {/* </li> */}
      {/* </ul> */}
    </nav>
  );
};

const OneButton = ({ to, label, className }) => {
  const history = useHistory();

  return (
    <button type="button" onClick={() => history.push(to)} className={className}>
      {label}
    </button>
  );
};

export { OneLink, OneButton };
