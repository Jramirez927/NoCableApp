import React, { useState } from "react";
import { NominatimResult } from "./PlaceSearch";

interface Props {
    place: NominatimResult;
    onSubmit: (data: { title: string; body: string; dateVisited: string }) => void;
    onCancel: () => void;
}

const JournalEntryForm: React.FC<Props> = ({ place, onSubmit, onCancel }) => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [dateVisited, setDateVisited] = useState(new Date().toISOString().split("T")[0]);

    return (
        <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
        }}>
            <div style={{
                background: "#fff",
                borderRadius: "8px",
                padding: "24px",
                width: "480px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
            }}>
                <h2 style={{ margin: 0 }}>New Journal Entry</h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>{place.display_name}</p>

                <input
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" }}
                />

                <textarea
                    placeholder="Write about your experience here..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={6}
                    style={{ padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc", resize: "vertical" }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <label style={{ fontSize: "13px", color: "#555" }}>Date visited</label>
                    <input
                        type="date"
                        value={dateVisited}
                        onChange={e => setDateVisited(e.target.value)}
                        style={{ padding: "8px", fontSize: "14px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>

                <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                    <button
                        onClick={onCancel}
                        style={{ padding: "8px 16px", cursor: "pointer" }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSubmit({ title, body, dateVisited })}
                        disabled={!title.trim()}
                        style={{ padding: "8px 16px", cursor: "pointer", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "4px" }}
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JournalEntryForm;