import React, { useState } from "react";
import { NominatimResult } from "../../components/LocationSearch/LocationSearch";
import JournalEntryForm from "./JournalEntryForm";

interface Props {
    selectedPlace: NominatimResult | null;
    onSubmit: (data: { title: string; body: string; dateVisited: string }) => void;
}

const AddJournalEntryButton: React.FC<Props> = ({ selectedPlace, onSubmit }) => {
    const [open, setOpen] = useState(false);

    if (!selectedPlace) return null;

    const handleSubmit = (data: { title: string; body: string; dateVisited: string }) => {
        onSubmit(data);
        setOpen(false);
    };

    return (
        <>
            <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 1000 }}>
                <button onClick={() => setOpen(prev => !prev)}>
                    Add Journal Entry
                </button>
            </div>
            {open && (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 1001,
                }}>
                    <JournalEntryForm
                        placeName={selectedPlace.display_name}
                        onSubmit={handleSubmit}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            )}
        </>
    );
};

export default AddJournalEntryButton;
