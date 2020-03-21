import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export function SectionTitle({ title }) {
  return <h2 className="contentsTitle">{title}</h2>;
}

export function Code({ indentation = 2, children }) {
  return <pre className="code">{JSON.stringify(children, null, indentation)}</pre>;
}

export function CodeSnippet({ children }) {
  return <pre className="code">{children}</pre>;
}

export function InlineCode({ children }) {
  return <span className="code">{children}</span>;
}

export function Link({ to, children }) {
  return (
    <RouterLink to={to} className={'linkToOtherDocs'}>
      {children}
    </RouterLink>
  );
}
