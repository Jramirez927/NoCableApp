import React, { useState } from "react";
import { Card, CloseButton, Button, Stack } from "react-bootstrap";
import { JournalEntry } from "../../api/journalEntries";

interface Props {
  entry: JournalEntry & { userName?: string };
  onClose: () => void;
  onDelete?: (id: number) => void;
}

const JournalEntryPopup: React.FC<Props> = ({ entry, onClose, onDelete }) => {
  const [placeExpanded, setPlaceExpanded] = useState(false);
  const dateVisited = new Date(entry.dateVisited).toLocaleDateString(
    undefined,
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <Stack className="align-items-center">
      <Card className="shadow" style={{ width: "280px" }}>
        <Card.Body className="py-2 px-3">
          <Stack direction="horizontal" className="justify-content-between align-items-start">
            <div>
              <small
                className="text-muted"
                onClick={() => setPlaceExpanded(p => !p)}
                style={{
                  marginBottom: "10px",
                  cursor: "pointer",
                  ...(placeExpanded ? {} : { overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }),
                }}
              >
                {entry.placeName}
              </small>
              <Card.Title as="h6" className="mb-0" style={{marginTop: "10px"}}>{entry.title}</Card.Title>
            </div>
            <CloseButton className="ms-2" onClick={onClose} />
          </Stack>
          <hr className="my-2" />
          <Card.Text style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
            {entry.body}
          </Card.Text>
          <Stack direction="horizontal" className="justify-content-between align-items-center">
            <small className="text-muted">{entry.userName ? `${entry.userName} · ` : ""}{dateVisited}</small>
            {onDelete && (
              <Button variant="light" size="sm" style={{ padding: "4px 6px" }} onClick={() => onDelete(entry.id)}><i className="bi bi-trash3"></i></Button>
            )}
          </Stack>
        </Card.Body>
      </Card>

      {/* Arrow pointing down to the map pin */}
      <i className="bi bi-caret-down-fill" style={{ color: "#fff", fontSize: "20px", marginTop: "-6px", lineHeight: 1 }} />
    </Stack>
  );
};

export default JournalEntryPopup;
