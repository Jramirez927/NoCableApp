import React, { useEffect, useState } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import { FeedEntry, getFeedEntries } from '../../api/JournalEntries';

const StorymapFeedPanel: React.FC = () => {
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeedEntries().then(({ data }) => {
      if (data) setEntries(data);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="p-3 text-center">
        <Spinner size="sm" />
      </div>
    );

  return (
    <>
      <div className="px-3 py-2 border-bottom fw-semibold">Feed</div>
      <ListGroup variant="flush">
        {entries.length === 0 ? (
          <ListGroup.Item className="text-muted text-center py-4">
            <i className="bi bi-people fs-1 d-block mb-2" />
            <small>No friend activity yet</small>
          </ListGroup.Item>
        ) : (
          entries.map((e) => (
            <ListGroup.Item key={e.id}>
              <div className="d-flex justify-content-between">
                <small className="fw-semibold">{e.userName}</small>
                <small className="text-muted">
                  {new Date(e.dateVisited).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </small>
              </div>
              <div className="mb-1">{e.title}</div>
              <small className="text-muted">
                <i className="bi bi-geo-alt" /> {e.placeName}
              </small>
            </ListGroup.Item>
          ))
        )}
      </ListGroup>
    </>
  );
};

export default StorymapFeedPanel;
