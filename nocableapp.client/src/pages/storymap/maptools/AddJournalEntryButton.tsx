import React from 'react';
import { JournalPlus } from 'react-bootstrap-icons';
import styles from './MapToolButton.module.css';

interface Props {
  open: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const AddJournalEntryButton: React.FC<Props> = ({ open, disabled, onToggle }) => (
  <button
    disabled={disabled}
    onClick={onToggle}
    title={open ? 'Close Journal Entry' : disabled ? 'Drop a pin first' : 'Add Journal Entry'}
    className={`${styles.btn} ${open ? styles.btnActive : ''}`}
  >
    <JournalPlus size={22} />
  </button>
);

export default AddJournalEntryButton;
