import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { Friend } from '../../../../api/Friends';

interface FriendsListProps {
  friends: Friend[];
  onRemove: (id: number) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ friends, onRemove }) => (
  <>
    <div className="px-3 pt-2 pb-1">
      <small className="text-muted fw-semibold">FRIENDS</small>
    </div>
    <ListGroup variant="flush">
      {friends.length === 0 ? (
        <ListGroup.Item className="text-muted text-center">
          <small>No friends yet</small>
        </ListGroup.Item>
      ) : (
        friends.map((f) => (
          <ListGroup.Item
            key={f.id}
            className="d-flex justify-content-between align-items-center"
          >
            <small>{f.userName}</small>
            <Button
              size="sm"
              variant="outline-danger"
              style={{ padding: '1px 6px' }}
              onClick={() => onRemove(f.id)}
            >
              <i className="bi bi-person-dash" />
            </Button>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  </>
);

export default FriendsList;
