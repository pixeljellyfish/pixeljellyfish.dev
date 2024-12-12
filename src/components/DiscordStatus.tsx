import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiscordStatus = () => {
    const [activity, setActivity] = useState('');
    const [details, setDetails] = useState('');
    const [largeImage, setLargeImage] = useState('');
    const [fileImage, setFileImage] = useState('');
    const [timestamps, setTimestamps] = useState({ start: 0, end: 0 });


useEffect(() => {
    const fetchDiscordStatus = async () => {
        try {
            const response = await axios.get(
                'https://api.lanyard.rest/v1/users/746276722902695957'
            );
            const { data } = response;

            const vsCodeActivity = data?.data?.activities?.find(
                (activity: { name: string }) => activity?.name === 'Visual Studio Code'
            );

            if (vsCodeActivity) {
                console.log('Fetched timestamps:', vsCodeActivity.timestamps);

                const startTimestamp = vsCodeActivity.timestamps?.start;
                if (startTimestamp && startTimestamp < 1e12) {
                    vsCodeActivity.timestamps.start = startTimestamp * 1000; // Convert to milliseconds if necessary
                }

                setActivity(vsCodeActivity.name);
                setDetails(vsCodeActivity.details);
                setLargeImage(vsCodeActivity.assets?.large_image ?? '');
                setFileImage(vsCodeActivity.assets?.large_text ?? '');
                setTimestamps({
                    start: vsCodeActivity.timestamps?.start ?? 0,
                    end: vsCodeActivity.timestamps?.end ?? 0,
                });
            }
        } catch (error) {
            console.error('Error fetching Discord status:', error);
        }
    };

    fetchDiscordStatus();
}, []);

    const formatTimestamp = (timestamp: number): string => {
        const totalSeconds = Math.floor((Date.now() - timestamp) / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <a className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 p-3 rounded-md border border-gray-800 dark:border-gray-400 shadow flex flex-row max-w-sm">
        <div className="discord-status">
            <div className="status-card">
                <div className="activity">
                    <div className="activity-info">
                        <div className="activity-image">
                            <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 256 254"><defs><linearGradient id="logosVisualStudioCode0" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stop-color="#FFF"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><path id="logosVisualStudioCode1" d="M180.828 252.605a15.872 15.872 0 0 0 12.65-.486l52.501-25.262a15.94 15.94 0 0 0 9.025-14.364V41.197a15.939 15.939 0 0 0-9.025-14.363l-52.5-25.263a15.877 15.877 0 0 0-18.115 3.084L74.857 96.35l-43.78-33.232a10.614 10.614 0 0 0-13.56.603L3.476 76.494c-4.63 4.211-4.635 11.495-.012 15.713l37.967 34.638l-37.967 34.637c-4.623 4.219-4.618 11.502.012 15.714l14.041 12.772a10.614 10.614 0 0 0 13.56.604l43.78-33.233l100.507 91.695a15.853 15.853 0 0 0 5.464 3.571Zm10.464-183.649l-76.262 57.889l76.262 57.888V68.956Z"/></defs><mask id="logosVisualStudioCode2" fill="#fff"><use href="#logosVisualStudioCode1"/></mask><path fill="#0065A9" d="M246.135 26.873L193.593 1.575a15.885 15.885 0 0 0-18.123 3.08L3.466 161.482c-4.626 4.219-4.62 11.502.012 15.714l14.05 12.772a10.625 10.625 0 0 0 13.569.604L238.229 33.436c6.949-5.271 16.93-.315 16.93 8.407v-.61a15.938 15.938 0 0 0-9.024-14.36Z" mask="url(#logosVisualStudioCode2)"/><path fill="#007ACC" d="m246.135 226.816l-52.542 25.298a15.887 15.887 0 0 1-18.123-3.08L3.466 92.207c-4.626-4.218-4.62-11.502.012-15.713l14.05-12.773a10.625 10.625 0 0 1 13.569-.603l207.132 157.135c6.949 5.271 16.93.315 16.93-8.408v.611a15.939 15.939 0 0 1-9.024 14.36Z" mask="url(#logosVisualStudioCode2)"/><path fill="#1F9CF0" d="M193.428 252.134a15.892 15.892 0 0 1-18.125-3.083c5.881 5.88 15.938 1.715 15.938-6.603V11.273c0-8.318-10.057-12.483-15.938-6.602a15.892 15.892 0 0 1 18.125-3.084l52.533 25.263a15.937 15.937 0 0 1 9.03 14.363V212.51c0 6.125-3.51 11.709-9.03 14.363l-52.533 25.262Z" mask="url(#logosVisualStudioCode2)"/><path fill="url(#logosVisualStudioCode0)" fill-opacity=".25" d="M180.828 252.605a15.874 15.874 0 0 0 12.65-.486l52.5-25.263a15.938 15.938 0 0 0 9.026-14.363V41.197a15.939 15.939 0 0 0-9.025-14.363L193.477 1.57a15.877 15.877 0 0 0-18.114 3.084L74.857 96.35l-43.78-33.232a10.614 10.614 0 0 0-13.56.603L3.476 76.494c-4.63 4.211-4.635 11.495-.012 15.713l37.967 34.638l-37.967 34.637c-4.623 4.219-4.618 11.502.012 15.714l14.041 12.772a10.614 10.614 0 0 0 13.56.604l43.78-33.233l100.506 91.695a15.857 15.857 0 0 0 5.465 3.571Zm10.464-183.65l-76.262 57.89l76.262 57.888V68.956Z" mask="url(#logosVisualStudioCode2)"/></svg>
                        <h2>{activity}</h2>
                        <p>{details}</p>
                        <p>Total Time: {formatTimestamp(timestamps.start)}</p>
                    </div>
                    <p className="text-xxs">
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
