import _ from 'lodash';
import React from 'react';

export function InteractionsList({ interactions }) {
  return (
    <>
      <div className="interactionsList">
        {_.isEmpty(interactions) && <p className="noResultsMsg">No Interactions yet</p>}
        {interactions.map((interaction, index) => (
          <div key={`${index}-unmatch`} className="unmatch">
            <InteractionsListItem interaction={interaction} />
          </div>
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
  const { requestMatcher } = item;
  return (
    <p>
      <i className="material-icons md-36 green">check</i>
      {requestMatcher.method} {requestMatcher.url}
    </p>
  );
}

function Unmatched({ requestDetails }) {
  const { url, method, headers, body } = requestDetails;
  return (
    <p>
      <i className="material-icons md-36 red">close</i>
      {method} {url} {JSON.stringify(headers)} {JSON.stringify(body)}
    </p>
  );
}
