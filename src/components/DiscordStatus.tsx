import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiscordStatus = () => {
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [timestamps, setTimestamps] = useState({ start: 0, end: 0 });

    useEffect(() => {
        const fetchDiscordStatus = async () => {
            try {
                const response = await axios.get(
                    'https://api.lanyard.rest/v1/users/746276722902695957'
                );

                const { data } = response;

                // Check if activities exist
                if (!data?.data?.activities) {
                    return;
                }

                // Check if VS Code activity exists
                const vsCodeActivity = data?.data?.activities?.find(
                    (activity: { name: string }) => activity?.name === 'Visual Studio Code'
                );

                if (!vsCodeActivity) {
                    return;
                }

                const { start = 0, end = 0 } = vsCodeActivity.timestamps || {};
                setTimestamps({ start, end });

                const details = vsCodeActivity.details || '';
                const fileNameMatch = details.match(/Editing (.+)$/);
                setFileName(fileNameMatch ? fileNameMatch[1] : 'Unknown File');
                setFileType(vsCodeActivity.state || 'Unknown Type');
            } catch (error) {
                console.error('Error fetching Discord status:', error);
            }
        };

        fetchDiscordStatus();
    }, []);

    const formatElapsedTime = (start: number): string => {
        const totalSeconds = Math.floor((Date.now() - start) / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="flex items-center space-x-4 p-2 rounded-lg bg-transparent border border-gray-800 dark:border-gray-400 shadow-md max-w-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
            {/* VS Code Logo (Font Awesome Icon) */}
            <div className="w-12 h-12 flex-shrink-0">
            <img width="48" height="48" src="https://img.icons8.com/nolan/48/visual-studio-code-2019.png" alt="visual-studio-code-2019"/>
            </div>

            {/* File Info */}
            <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {fileName}
                </h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">{fileType}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                    Editing for {formatElapsedTime(timestamps.start)}
                </p>
            </div>
        </div>
    );
};

export default DiscordStatus;
