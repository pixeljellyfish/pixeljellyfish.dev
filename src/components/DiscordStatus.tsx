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
        const fetchDiscordStatus = async () => {
            try {
                const response = await axios.get(
                    'https://api.lanyard.rest/v1/users/746276722902695957'
                );
                const { data } = response;

                const vsCodeActivity = data?.data?.activities?.find(
                    (activity) => activity?.name === 'Visual Studio Code'
                );

                if (vsCodeActivity) {
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

    // Update elapsed time every second
    useEffect(() => {
        if (timestamps.start) {
            const interval = setInterval(() => {
                const totalSeconds = Math.floor((Date.now() - timestamps.start) / 1000);
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;

                setElapsedTime(`${hours}h ${minutes}m
