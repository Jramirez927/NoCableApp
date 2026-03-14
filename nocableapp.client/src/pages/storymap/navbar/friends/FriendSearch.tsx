import React, { useState } from 'react';
import { Form, InputGroup, Button, ListGroup, Spinner } from 'react-bootstrap';
import { UserSearchResult, sendFriendRequest, searchUsers } from '../../../../api/Friends';

interface FriendSearchProps {
  onRequestSent: (userName: string) => void;
}

const FriendSearch: React.FC<FriendSearchProps> = ({ onRequestSent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    const { data } = await searchUsers(searchQuery);
    if (data) setSearchResults(data);
    setSearching(false);
  };

  const handleSendRequest = async (userName: string) => {
    await sendFriendRequest(userName);
    setSearchResults((prev) => prev.filter((u) => u.userName !== userName));
    onRequestSent(userName);
  };

  return (
    <div className="px-3 py-2 border-bottom">
      <Form onSubmit={handleSearch}>
        <InputGroup size="sm">
          <Form.Control
            placeholder="Search by username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="outline-secondary" disabled={searching}>
            {searching ? <Spinner size="sm" /> : <i className="bi bi-search" />}
          </Button>
        </InputGroup>
      </Form>
      {searchResults.length > 0 && (
        <ListGroup variant="flush" className="mt-1">
          {searchResults.map((u) => (
            <ListGroup.Item
              key={u.id}
              className="d-flex justify-content-between align-items-center px-0 py-1"
            >
              <small>{u.userName}</small>
              <Button
                size="sm"
                variant="outline-primary"
                style={{ padding: '1px 6px' }}
                onClick={() => handleSendRequest(u.userName)}
              >
                <i className="bi bi-person-plus" />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default FriendSearch;
