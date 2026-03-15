import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { JournalEntry } from '../../../api/JournalEntries';

interface Props {
  entries: JournalEntry[];
  onSelect: (entry: JournalEntry) => void;
}

const StorymapSidebar: React.FC<Props> = ({ entries, onSelect }) => {
  return (
    <>
      <div className="px-3 py-2 border-bottom fw-semibold bg-white sticky-top">Journal Entries</div>
      <ListGroup variant="flush">
        {entries.map((entry) => (
          <ListGroup.Item key={entry.id} action onClick={() => onSelect(entry)} style={{ cursor: 'pointer' }}>
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
