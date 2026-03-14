import React from 'react';
import { JournalPlus } from 'react-bootstrap-icons';

interface Props {
  open: boolean;
  onToggle: () => void;
}

const AddJournalEntryButton: React.FC<Props> = ({ open, onToggle }) => (
  <button
    onClick={onToggle}
    title={open ? 'Close Journal Entry' : 'Add Journal Entry'}
    style={{ padding: '8px 10px', ...(open ? { background: '#0d6efd', color: 'white' } : {}) }}
  >
    <JournalPlus size={22} />
  </button>
);

export default AddJournalEntryButton;
