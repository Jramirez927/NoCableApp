import React, { useEffect, useState } from 'react';
import {
  Friend,
  FriendRequest,
  getFriends,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from '../../../api/Friends';
import FriendSearch from './friends/FriendSearch';
import FriendRequests from './friends/FriendRequests';
import FriendsList from './friends/FriendsList';

const StorymapFriendsPanel: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    getFriends().then(({ data }) => {
      if (data) setFriends(data);
    });
    getFriendRequests().then(({ data }) => {
      if (data) setRequests(data);
    });
  }, []);

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
      <FriendSearch onRequestSent={() => {}} />
      <FriendRequests requests={requests} onAccept={handleAccept} onDecline={handleDecline} />
      <FriendsList friends={friends} onRemove={handleRemove} />
    </>
  );
};

export default StorymapFriendsPanel;
