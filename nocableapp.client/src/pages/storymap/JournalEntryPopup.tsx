import React from "react";
import { JournalEntry } from "../../api/journalEntries";

interface Props {
  entry: JournalEntry;
  onClose: () => void;
}

const JournalEntryPopup: React.FC<Props> = ({ entry, onClose }) => {
  const dateVisited = new Date(entry.dateVisited).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "6px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          width: "280px",
          padding: "10px 14px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "15px" }}>{entry.title}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>{entry.placeName}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              color: "#888",
              lineHeight: 1,
              padding: 0,
              marginLeft: "8px",
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <hr style={{ margin: "8px 0" }} />
        <p style={{ whiteSpace: "pre-wrap", margin: "0 0 8px", fontSize: "14px" }}>
          {entry.body}
        </p>
        <small style={{ color: "#aaa" }}>{dateVisited}</small>
      </div>

      {/* Arrow pointing down to the map pin */}
      <i className="bi bi-caret-down-fill" style={{ color: "#fff", fontSize: "20px", marginTop: "-6px", lineHeight: 1 }} />
    </div>
  );
};

export default JournalEntryPopup;
