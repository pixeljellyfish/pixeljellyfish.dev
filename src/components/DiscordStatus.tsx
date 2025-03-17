import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define the DiscordStatus component as a functional React component
const DiscordStatus = () => {
    // State to store the name of the file being edited in VS Code
    const [fileName, setFileName] = useState<string>('');

    // State to store the type or language of the file (e.g., "TypeScript")
    const [fileType, setFileType] = useState<string>('');

    // State to store the start and end timestamps of the VS Code activity
    const [timestamps, setTimestamps] = useState<{ start: number; end: number }>({ start: 0, end: 0 });

    // useEffect hook to fetch Discord status when the component mounts
    useEffect(() => {
        // Async function to fetch data from the Lanyard API
        const fetchDiscordStatus = async () => {
            try {
                // Make a GET request to the Lanyard API for a specific user's status
                // Link to get Lanyard https://github.com/Phineas/lanyard
                // User ID: 746276722902695957 (presumably your Discord ID)
                // How to get your Discord ID:
                //     Step 1. Enable developer mode in discord Advanced Settings
                //     Step 2. Right click your profile
                //     Step 3. Click copy User ID and done.


                const response = await axios.get(
                    'https://api.lanyard.rest/v1/users/746276722902695957'
                );

                // Extract the data object from the API response
                const { data } = response;

                // Check if activities exist in the response; if not, exit early
                if (!data?.data?.activities) {
                    return;
                }

                // Find the VS Code activity from the list of activities
                // Filters activities by name to match "Visual Studio Code"
                const vsCodeActivity = data?.data?.activities?.find(
                    (activity: { name: string }) => activity?.name === 'Visual Studio Code'
                );

                // If no VS Code activity is found, exit early
                if (!vsCodeActivity) {
                    return;
                }

                // Extract start and end timestamps from the VS Code activity, defaulting to 0 if absent
                const { start = 0, end = 0 } = vsCodeActivity.timestamps || {};

                // Update the timestamps state with the fetched values
                setTimestamps({ start, end });

                // Extract the "details" field (e.g., "Editing main.tsx") from the VS Code activity
                const details = vsCodeActivity.details || '';

                // Use regex to extract the filename from the details string (e.g., "main.tsx" from "Editing main.tsx")
                const fileNameMatch = details.match(/Editing (.+)$/);

                // Set the filename; if regex matches, use the captured group, otherwise use "Unknown File"
                setFileName(fileNameMatch ? fileNameMatch[1] : 'Unknown File');

                // Set the file type from the "state" field (e.g., "TypeScript"), defaulting to "Unknown Type"
                setFileType(vsCodeActivity.state || 'Unknown Type');
            } catch (error) {
                // Log any errors that occur during the API request to the console
                console.error('Error fetching Discord status:', error);
            }
        };

        // Call the fetch function when the component mounts
        fetchDiscordStatus();
    }, []); // Empty dependency array ensures this runs only once on mount

    // Utility function to format elapsed time since the activity started
const formatElapsedTime = (start: number): string => {
    // Calculate total seconds elapsed from the start timestamp to now
    const totalSeconds = Math.floor((Date.now() - start) / 1000);

    // Convert seconds to hours, minutes, and remaining seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Corrected to show minutes within the hour
    const seconds = totalSeconds % 60;

    // Return formatted string (e.g., "2h 34m 15s")
    return `${hours}h ${minutes}m ${seconds}s`;
};

    // Render the component UI
    return (
        // Container div with styling for layout, hover effects, and theming
        <div className="flex items-center space-x-4 p-2 rounded-lg bg-transparent border border-gray-800 dark:border-gray-400 shadow-md max-w-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            {/* VS Code Logo Section */}
            <div className="w-12 h-12 flex-shrink-0">
                {/* External image for VS Code logo, sized at 48x48 pixels */}
                <img
                    width="48"
                    height="48"
                    src="https://img.icons8.com/nolan/48/visual-studio-code-2019.png"
                    alt="visual-studio-code-2019"
                />
            </div>

            {/* File Information Section */}
            <div className="flex-1">
                {/* File name display, truncated if too long */}
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {fileName}
                </h2>

                {/* File type or language display */}
                <p className="text-xs text-gray-600 dark:text-gray-400">{fileType}</p>

                {/* Elapsed editing time display */}
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    Editing for {formatElapsedTime(timestamps.start)}
                </p>
            </div>
        </div>
    );
};

// Export the component for use in other parts of the application
export default DiscordStatus;
