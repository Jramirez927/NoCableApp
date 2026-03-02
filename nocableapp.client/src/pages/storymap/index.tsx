import React from "react";
import { useAuth } from "../../contexts/AuthProvider";

const StoryMap: React.FC = () => {
    const { user } = useAuth();
    return (
        <div>
            <h1> Welcome {user?.email} </h1>
            <p>This is the StoryMap page.</p>
        </div>
    );
};

export default StoryMap;