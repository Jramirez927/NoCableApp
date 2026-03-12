import { safeFetch } from "./safeFetch";

export interface Friend {
    id: number;
    userName: string;
}

export interface FriendRequest {
    id: number;
    requesterUserName: string;
}

export interface UserSearchResult {
    id: string;
    userName: string;
}

export function getFriends() {
    return safeFetch<Friend[]>(async () => {
        const res = await fetch("/api/friends", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch friends.");
        return res.json();
    });
}

export function getFriendRequests() {
    return safeFetch<FriendRequest[]>(async () => {
        const res = await fetch("/api/friends/requests", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch friend requests.");
        return res.json();
    });
}

export function sendFriendRequest(userName: string) {
    return safeFetch<void>(async () => {
        const res = await fetch(`/api/friends/request/${encodeURIComponent(userName)}`, {
            method: "POST",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to send friend request.");
    });
}

export function acceptFriendRequest(id: number) {
    return safeFetch<void>(async () => {
        const res = await fetch(`/api/friends/${id}/accept`, {
            method: "PUT",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to accept friend request.");
    });
}

export function declineFriendRequest(id: number) {
    return safeFetch<void>(async () => {
        const res = await fetch(`/api/friends/${id}/decline`, {
            method: "PUT",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to decline friend request.");
    });
}

export function removeFriend(id: number) {
    return safeFetch<void>(async () => {
        const res = await fetch(`/api/friends/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to remove friend.");
    });
}

export function searchUsers(query: string) {
    return safeFetch<UserSearchResult[]>(async () => {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to search users.");
        return res.json();
    });
}
