import React from 'react';
import { Search } from 'react-bootstrap-icons';
import styles from './MapToolButton.module.css';

interface Props {
  open: boolean;
  onToggle: () => void;
}

const LocationSearchToggle: React.FC<Props> = ({ open, onToggle }) => (
  <button
    onClick={onToggle}
    title={open ? 'Close Search' : 'Search Location'}
    className={`${styles.btn} ${open ? styles.btnActive : ''}`}
  >
    <Search size={22} />
  </button>
);

export default LocationSearchToggle;
