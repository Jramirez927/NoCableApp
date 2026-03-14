import React from 'react';
import styles from './Storymap.module.css';

type Panel = 'entries' | 'feed' | 'friends' | null;

interface Props {
  activePanel: Panel;
  onToggle: (panel: Panel) => void;
}

const StorymapIconNavbar: React.FC<Props> = ({ activePanel, onToggle }) => {
  return (
    <div className={styles.iconNavbar}>
      <button
        className={`${styles.iconNavbarBtn} ${activePanel === 'feed' ? styles.iconNavbarBtnActive : ''}`}
        onClick={() => onToggle(activePanel === 'feed' ? null : 'feed')}
        title="Feed"
      >
        <i className="bi bi-house-fill" />
      </button>
      <button
        className={`${styles.iconNavbarBtn} ${activePanel === 'entries' ? styles.iconNavbarBtnActive : ''}`}
        onClick={() => onToggle(activePanel === 'entries' ? null : 'entries')}
        title="Journal Entries"
      >
        <i className="bi bi-journal-text" />
      </button>
      <button
        className={`${styles.iconNavbarBtn} ${activePanel === 'friends' ? styles.iconNavbarBtnActive : ''}`}
        onClick={() => onToggle(activePanel === 'friends' ? null : 'friends')}
        title="Friends"
      >
        <i className="bi bi-people-fill" />
      </button>
    </div>
  );
};

export default StorymapIconNavbar;
