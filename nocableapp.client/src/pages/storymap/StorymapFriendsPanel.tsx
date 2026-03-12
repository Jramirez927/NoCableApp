import React, { useEffect, useState } from "react";
import { Form, InputGroup, Button, ListGroup, Spinner } from "react-bootstrap";
import {
    Friend,
    FriendRequest,
    UserSearchResult,
    getFriends,
    getFriendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    searchUsers,
} from "../../api/friends";

const StorymapFriendsPanel: React.FC = () => {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        getFriends().then(({ data }) => { if (data) setFriends(data); });
        getFriendRequests().then(({ data }) => { if (data) setRequests(data); });
    }, []);

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
    };

    const handleAccept = async (id: number) => {
        await acceptFriendRequest(id);
        const accepted = requests.find((r) => r.id === id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
        if (accepted) setFriends((prev) => [...prev, { id, userName: accepted.requesterUserName }]);
    };

    const handleDecline = async (id: number) => {
        await declineFriendRequest(id);
        setRequests((prev) => prev.filter((r) => r.id !== id));
    };

    const handleRemove = async (id: number) => {
        await removeFriend(id);
        setFriends((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <>
            <div className="px-3 py-2 border-bottom fw-semibold">Friends</div>

            {/* Search */}
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
                            <ListGroup.Item key={u.id} className="d-flex justify-content-between align-items-center px-0 py-1">
                                <small>{u.userName}</small>
                                <Button size="sm" variant="outline-primary" style={{ padding: "1px 6px" }} onClick={() => handleSendRequest(u.userName)}>
                                    <i className="bi bi-person-plus" />
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </div>

            {/* Incoming Requests */}
            {requests.length > 0 && (
                <>
                    <div className="px-3 pt-2 pb-1">
                        <small className="text-muted fw-semibold">REQUESTS</small>
                    </div>
                    <ListGroup variant="flush">
                        {requests.map((r) => (
                            <ListGroup.Item key={r.id} className="d-flex justify-content-between align-items-center">
                                <small>{r.requesterUserName}</small>
                                <div className="d-flex gap-1">
                                    <Button size="sm" variant="outline-success" style={{ padding: "1px 6px" }} onClick={() => handleAccept(r.id)}>
                                        <i className="bi bi-check-lg" />
                                    </Button>
                                    <Button size="sm" variant="outline-danger" style={{ padding: "1px 6px" }} onClick={() => handleDecline(r.id)}>
                                        <i className="bi bi-x-lg" />
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )}

            {/* Friends List */}
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
                        <ListGroup.Item key={f.id} className="d-flex justify-content-between align-items-center">
                            <small>{f.userName}</small>
                            <Button size="sm" variant="outline-danger" style={{ padding: "1px 6px" }} onClick={() => handleRemove(f.id)}>
                                <i className="bi bi-person-dash" />
                            </Button>
                        </ListGroup.Item>
                    ))
                )}
            </ListGroup>
        </>
    );
};

export default StorymapFriendsPanel;
