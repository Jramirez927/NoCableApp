import { safeFetch } from "./safeFetch";

export interface JournalEntryPayload {
    title: string;
    body: string;
    placeName: string;
    latitude: number;
    longitude: number;
    dateVisited: string;
}

export interface JournalEntry {
    id: number;
    title: string;
    body: string;
    placeName: string;
    latitude: number;
    longitude: number;
    dateVisited: string;
    createdAt: string;
}

export async function getJournalEntries() {
    return safeFetch<JournalEntry[]>(async () => {
        const res = await fetch("/api/journalentries", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch journal entries.");
        return res.json();
    });
}

export async function deleteJournalEntry(id: number) {
    return safeFetch<void>(async () => {
        const res = await fetch(`/api/journalentries/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to delete journal entry.");
    });
}

export interface FeedEntry extends JournalEntry {
    userName: string;
}

export async function getFeedEntries() {
    return safeFetch<FeedEntry[]>(async () => {
        const res = await fetch("/api/journalentries/feed", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch feed.");
        return res.json();
    });
}

export async function createJournalEntry(payload: JournalEntryPayload) {
    return safeFetch<JournalEntry>(async () => {
        const res = await fetch("/api/journalentries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create journal entry.");
        return res.json();
    });
}
