import React from 'react';
import { useEffect, useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';

const MusicCard = () => {
  const [track, setTrack] = useState<{
    song: string;
    artist: string;
    albumArtUrl: string | null;
    startTime: number;
    endTime: number;
  } | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch Spotify status from Lanyard API
  // This function checks if the user is listening to Spotify and retrieves the track information
  // get both userid and activity name from the lanyard API
  // https://api.lanyard.rest/v1/users/746276722902695957
  // 
  const fetchSpotifyStatus = async (): Promise<void> => {
    const userIds = ['454648470012166155', '746276722902695957'];
    try {
      const responses = await Promise.all(
        userIds.map(id =>
          axios.get(`https://api.lanyard.rest/v1/users/${id}`).catch((error: unknown): null => {
            console.error(`Error fetching status for user ${id}:`, error);
            return null;
          })
        )
      );
      const validResponses = responses.filter((response): response is AxiosResponse => response !== null);
      if (validResponses.length === 0) {
        setTrack(null);
        console.log('No valid responses from Lanyard API, hiding MusicCard');
        return;
      }

      const { data } = validResponses[0];
      const spotifyActivity = data?.data?.activities?.find(
        (activity: { name: string }) => activity.name === 'Spotify'
      );

      if (!spotifyActivity || !data.data.listening_to_spotify) {
        setTrack(null);
        console.log('No Spotify activity or not listening, hiding MusicCard');
        return;
      }

      const spotifyData = data.data.spotify;
      if (!spotifyData) {
        setTrack(null);
        console.log('No Spotify data found, hiding MusicCard');
        return;
      }

      const startTime = spotifyData.timestamps.start;
      const endTime = spotifyData.timestamps.end;
      const durationMs = endTime - startTime;

      setTrack({
        song: spotifyData.song || 'Unknown Song',
        artist: spotifyData.artist || 'Unknown Artist',
        albumArtUrl: spotifyData.album_art_url || null,
        startTime,
        endTime,
      });
      setDuration(durationMs / 1000);

      console.log('Spotify track detected:', {
        song: spotifyData.song,
        artist: spotifyData.artist,
        albumArtUrl: spotifyData.album_art_url,
        startTime,
        endTime,
      });
    } catch (error) {
      console.error('Error fetching Spotify status:', error);
      setTrack(null);
    }
  };

  useEffect(() => {
    console.log('MusicCard component loaded');
    fetchSpotifyStatus();
    fetchIntervalRef.current = setInterval(fetchSpotifyStatus, 10000);

    return () => {
      if (fetchIntervalRef.current) clearInterval(fetchIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!track) {
      setProgress(0);
      setCurrentTime(0);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    }

    const updateProgress = (): void => {
      if (!track) {
        setProgress(0);
        setCurrentTime(0);
        return;
      }

      const now = Date.now();
      const elapsed = (now - track.startTime) / 1000;
      const totalDuration = (track.endTime - track.startTime) / 1000;
      const progressPercent = (elapsed / totalDuration) * 100;

      setCurrentTime(elapsed);
      setProgress(Math.min(progressPercent, 100));

      console.log('Progress update:', { elapsed, totalDuration, progressPercent });
    };

    updateProgress();
    progressIntervalRef.current = setInterval(updateProgress, 1000);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [track]);

  if (!track) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg bg-transparent border border-gray-800 dark:border-gray-400 shadow-md max-w-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      {/* Album Cover */}
      <div className="w-12 h-12 flex-shrink-0">
        {track.albumArtUrl ? (
          <img
            width="48"
            height="48"
            src={track.albumArtUrl}
            alt="Album cover"
            className="rounded object-cover"
          />
        ) : (
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/nolan/48/spotify.png"
            alt="spotify"
          />
        )}
      </div>

      {/* Track Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {track.song}
        </h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
          {track.artist}
        </p>

        {/* Progress Bar */}
        <div className="relative w-full h-2 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Time Display */}
        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time in MM:SS
const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

export default MusicCard;