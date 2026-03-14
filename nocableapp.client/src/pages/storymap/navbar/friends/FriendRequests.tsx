import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { FriendRequest } from '../../../../api/Friends';

interface FriendRequestsProps {
  requests: FriendRequest[];
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

const FriendRequests: React.FC<FriendRequestsProps> = ({ requests, onAccept, onDecline }) => {
  if (requests.length === 0) return null;

  return (
    <>
      <div className="px-3 pt-2 pb-1">
        <small className="text-muted fw-semibold">REQUESTS</small>
      </div>
      <ListGroup variant="flush">
        {requests.map((r) => (
          <ListGroup.Item
            key={r.id}
            className="d-flex justify-content-between align-items-center"
          >
            <small>{r.requesterUserName}</small>
            <div className="d-flex gap-1">
              <Button
                size="sm"
                variant="outline-success"
                style={{ padding: '1px 6px' }}
                onClick={() => onAccept(r.id)}
              >
                <i className="bi bi-check-lg" />
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                style={{ padding: '1px 6px' }}
                onClick={() => onDecline(r.id)}
              >
                <i className="bi bi-x-lg" />
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
};

export default FriendRequests;
