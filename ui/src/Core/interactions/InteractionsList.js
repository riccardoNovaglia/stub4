import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import { useState } from 'react';
import { Matched, Unmatched } from './InteractionItems';

export function InteractionsList({ interactions }) {
  const [group, setGroup] = useState(false);
  return (
    <>
      <div className="interactionsFilterBlock">
        <button className="groupInteractions" onClick={() => setGroup(!group)}>
          Group <i className="material-icons">filter_alt</i>
        </button>
      </div>
      <div className="interactionsList">
        {isEmpty(interactions) && <p className="noInteractions">No Interactions yet</p>}
        {group ? (
          <GroupedInteractions interactions={interactions} />
        ) : (
          <AllInteractions interactions={interactions} />
        )}
      </div>
    </>
  );
}

function AllInteractions({ interactions }) {
  return (
    <>
      {interactions.map((interaction, index) => (
        <div className="interaction" key={`${index}-interaction`}>
          {interaction.matched ? (
            <Matched item={interaction.item} />
          ) : (
            <Unmatched requestDetails={interaction.requestDetails} />
          )}
        </div>
      ))}
    </>
  );
}

function GroupedInteractions({ interactions }) {
  const groupedMatched = groupMatched(
    interactions.filter((interaction) => interaction.matched === true)
  );
  const groupedUnmatched = groupUnmatched(
    interactions.filter((interaction) => interaction.matched === false)
  );

  return (
    <>
      {groupedMatched.map((group, index) => (
        <div className="interaction" key={`${index}-interaction`}>
          <Matched item={group.item} count={group.count} />
        </div>
      ))}
      {groupedUnmatched.map((group, index) => (
        <div className="interaction" key={`${index}-interaction`}>
          <Unmatched requestDetails={group.requestDetails} count={group.count} />
        </div>
      ))}
    </>
  );
}

function groupMatched(matchedInteractions) {
  return matchedInteractions.reduce((previous, current) => {
    const group = previous.find((group) => group.id === current?.item?.id);
    if (group) {
      group.count += 1;
    } else {
      previous.push({
        count: 1,
        id: current?.item?.id,
        item: current.item
      });
    }
    return previous;
  }, []);
}

function groupUnmatched(unmatchedInteractions) {
  return unmatchedInteractions.reduce((previous, current) => {
    const group = previous.find((group) => isEqual(group.requestDetails, current?.requestDetails));
    if (group) {
      group.count += 1;
    } else {
      previous.push({
        count: 1,
        requestDetails: current.requestDetails
      });
    }
    return previous;
  }, []);
}
