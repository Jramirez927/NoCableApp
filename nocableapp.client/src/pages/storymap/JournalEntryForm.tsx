import React, { useState } from 'react';

interface Props {
  placeName: string;
  onSubmit: (data: { title: string; body: string; dateVisited: string }) => void;
  onCancel: () => void;
}

const JournalEntryForm: React.FC<Props> = ({ placeName, onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [dateVisited, setDateVisited] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, body, dateVisited });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          width: '320px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ fontWeight: 600, fontSize: '14px', color: '#555' }}>{placeName}</div>
        <input
          required
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <textarea
          required
          placeholder="Write your journal entry..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          style={{
            padding: '8px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            resize: 'vertical',
          }}
        />
        <input
          required
          type="date"
          value={dateVisited}
          onChange={(e) => setDateVisited(e.target.value)}
          style={{
            padding: '8px',
            fontSize: '14px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit">Save Entry</button>
        </div>
      </form>
      <i
        className="bi bi-caret-down-fill"
        style={{ color: '#fff', fontSize: '20px', marginTop: '-6px', lineHeight: 1 }}
      />
    </div>
  );
};

export default JournalEntryForm;
