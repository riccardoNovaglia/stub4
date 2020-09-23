import _ from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';

export function InteractionsList({ interactions }) {
  return (
    <>
      <div className="interactionsList">
        {_.isEmpty(interactions) && <p className="noInteractions">No Interactions yet</p>}
        {interactions.map((interaction, index) => (
          <span key={`${index}-interaction`}>
            <InteractionsListItem interaction={interaction} index={index} />
          </span>
        ))}
      </div>
    </>
  );
}

function InteractionsListItem({ interaction }) {
  const { matched } = interaction;
  return (
    <div className="interaction">
      {matched ? (
        <Matched item={interaction.item} />
      ) : (
        <Unmatched requestDetails={interaction.requestDetails} />
      )}
    </div>
  );
}

function Matched({ item }) {
  const { id, requestMatcher, type } = item;
  const history = useHistory();
  const destination = `/stub4/${type.toLowerCase()}/edit/${id}`;
  return (
    <a
      className="interactionLink"
      href={destination}
      onClick={(e) => {
        e.preventDefault();
        history.push(destination);
      }}
    >
      <i className="material-icons md-36 green">check</i>
      {requestMatcher.method} {requestMatcher.url}
    </a>
  );
}

function Unmatched({ requestDetails }) {
  const { url, method, headers, body } = requestDetails;
  const history = useHistory();
  const destination = '/stub4/stubs/new';
  return (
    <a
      className="interactionLink"
      href={destination}
      onClick={(e) => {
        e.preventDefault();
        history.push(destination);
      }}
    >
      <i className="material-icons md-36 red">close</i>
      {method} {url} {JSON.stringify(headers)} {JSON.stringify(body)}
    </a>
  );
}
