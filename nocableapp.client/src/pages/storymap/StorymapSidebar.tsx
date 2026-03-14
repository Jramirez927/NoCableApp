import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { JournalEntry } from '../../api/JournalEntries';

interface Props {
  entries: JournalEntry[];
}

const StorymapSidebar: React.FC<Props> = ({ entries }) => {
  return (
    <>
      <div className="px-3 py-2 border-bottom fw-semibold">Journal Entries</div>
      <ListGroup variant="flush">
        {entries.map((entry) => (
          <ListGroup.Item key={entry.id}>
            <div className="fw-bold">{entry.title}</div>
            <small className="text-muted d-block">{entry.placeName}</small>
            <small className="text-muted">
              {new Date(entry.dateVisited).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default StorymapSidebar;
