import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiscordStatus = () => {
    const [activity, setActivity] = useState('');
    const [details, setDetails] = useState('');
    const [largeImage, setLargeImage] = useState('');
    const [fileImage, setFileImage] = useState('');
    const [timestamps, setTimestamps] = useState({ start: 0, end: 0 });
    const [elapsedTime, setElapsedTime] = useState('');

    useEffect(() => {
        console.log("Fetching Discord Status..."); // Check if the useEffect is triggered

        const fetchDiscordStatus = async () => {
            try {
                const response = await axios.get(
                    'https://api.lanyard.rest/v1/users/746276722902695957'
                );
                console.log("API Response:", response); // Log the entire response

                const { data } = response;
                // Just fetch the first activity from the response without filtering for VSCode
                const activity = data?.data?.activities?.[0]; // Get the first activity
                
                if (activity) {
                    console.log('Found Activity:', activity); // Check if an activity is found

                    const startTimestamp = activity.timestamps?.start;
                    if (startTimestamp && startTimestamp < 1e12) {
                        activity.timestamps.start = startTimestamp * 1000; // Convert to milliseconds if necessary
                    }

                    setActivity(activity.name);
                    setDetails(activity.details);
                    setLargeImage(activity.assets?.large_image ?? '');
                    setFileImage(activity.assets?.large_text ?? '');
                    setTimestamps({
                        start: activity.timestamps?.start ?? 0,
                        end: activity.timestamps?.end ?? 0,
                    });
                } else {
                    console.log('No activity found');
                }
            } catch (error) {
                console.error('Error fetching Discord status:', error);
            }
        };

        fetchDiscordStatus();
    }, []);

    useEffect(() => {
        console.log("Updated timestamps:", timestamps); // Log updated timestamps state
        if (timestamps.start) {
            const interval = setInterval(() => {
                const now = Math.floor(Date.now() / 1000); // Current time in seconds
                const totalSeconds = now - timestamps.start; // Elapsed time in seconds

                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
            }, 1000);

            return () => clearInterval(interval);
        }
        return undefined;
    }, [timestamps.start]);

    return (
        <a className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 p-3 rounded-md border border-gray-800 dark:border-gray-400 shadow flex flex-row max-w-sm">
            <div className="discord-status">
                <div className="status-card">
                    <div className="activity">
                        <div className="activity-info">
                            <div className="activity-image">
                                {/* You can change this to any other image or SVG as needed */}
                                <h2>{activity}</h2>
                                <p>{details}</p>
                                <p>Time Elapsed: {elapsedTime}</p>
                            </div>
                            <p className="text-xxs">
                                {/* This is an icon for the activity, you can replace or remove it */}
                                <svg xmlns="http://www.w3.org/2000/svg" className="fill-current h-[1.9em] inline" viewBox="0 0 24 24"><path fill="#888888" d="m21.29 4.1l-4.12-2a1.36 1.36 0 0 0-.48-.1h-.08a1.18 1.18 0 0 0-.72.24l-.14.12l-7.88 7.19L4.44 7a.83.83 0 0 0-.54-.17a.88.88 0 0 0-.53.17l-1.1 1a.8.8 0 0 0-.27.61a.84.84 0 0 0 .27.62l3 2.71l-3 2.72a.84.84 0 0 0 0 1.23l1.1 1a.89.89 0 0 0 .6.22a.93.93 0 0 0 .47-.17l3.43-2.61l7.88 7.19a1.2 1.2 0 0 0 .76.36h.17a1 1 0 0 0 .49-.12l4.12-2a1.25 1.25 0 0 0 .71-1.1V5.23a1.26 1.26 0 0 0-.71-1.13zM17 16.47l-6-4.53l6-4.53z" /></svg> Visual Studio Code
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}

export default DiscordStatus;
