import * as React from 'react';  // Import React properly
import { useLastFM } from 'use-last-fm';

export const MusicCard = () => {
    const truncate = (str: string, n: number) => str.length > n ? str.substr(0, n - 1) + '...' : str;
    const lastFM = useLastFM('pixel-donut12', "b1cd73ea885ff9d6a9ddb143c56d7667", 5000, 'large');

    // Ensure lastFM.status is a string and is valid
    if (['connecting', 'error'].includes(lastFM.status as string)) return null;

    return (
        <a
            href={lastFM.status === 'playing' ? lastFM.song.url : 'https://www.last.fm/user/pixel-donut12'}
            rel="noopener noreferrer"
            target="_blank"
            className="focus:outline-none transition duration-300 ease-in-out transform hover:scale-105 p-3 rounded-md border border-gray-800 dark:border-gray-400 shadow flex flex-row max-w-sm">
            {lastFM.status === 'idle' && (
                <img
                    height={52}
                    width={45}
                    alt="Song cover art"
                    placeholder="blur"
                    className="rounded shadow max-h-[45px]"
                    src="/img/idle-music.png"
                />
            )}
            {lastFM.status === 'playing' && (
                <img
                    alt={lastFM.song.name}
                    className="rounded shadow max-h-[52px] max-w-[52px]"
                    src={lastFM.song.art}
                />
            )}
            <div className="my-auto ml-4">
                <div className="font-semibold text-sm sm:text-regular">
                    {lastFM.status === 'playing' ?
                        `Listening to ${truncate(lastFM.song.name, 52)}` :
                        'Not listening to anything'}
                </div>
                <p className="text-xs flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="fill-current h-[1.9em] inline"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill="#888888"
                            d="M12.01 2.019c-5.495 0-9.991 4.496-9.991 9.991c0 5.494 4.496 9.99 9.991 9.99c5.494 0 9.99-4.496 9.99-9.99c0-5.495-4.446-9.991-9.99-9.991zm4.595 14.436c-.199.299-.549.4-.85.201c-2.349-1.45-5.296-1.75-8.793-.951c-.348.102-.648-.148-.748-.449c-.101-.35.149-.648.45-.749c3.795-.85 7.093-.499 9.69 1.1c.35.149.4.548.251.848zm1.2-2.747c-.251.349-.7.499-1.051.249c-2.697-1.646-6.792-2.148-9.939-1.148c-.398.101-.85-.1-.949-.498c-.101-.402.1-.852.499-.952c3.646-1.098 8.143-.548 11.239 1.351c.3.149.45.648.201.998zm.099-2.799c-3.197-1.897-8.542-2.097-11.59-1.146a.938.938 0 0 1-1.148-.6a.937.937 0 0 1 .599-1.151c3.547-1.049 9.392-.85 13.089 1.351c.449.249.599.849.349 1.298c-.25.35-.849.498-1.299.248z"
                        />
                    </svg>
                    Spotify
                </p>
                {lastFM.status === 'playing' && (
                    <p className="text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="fill-current h-[1.9em] inline" viewBox="0 0 24 24">
                            <g id="evaHeadphonesOutline0">
                                <g id="evaHeadphonesOutline1">
                                    <path id="evaHeadphonesOutline2" fill="#888888" d="M12 2A10.2 10.2 0 0 0 2 12.37V17a4 4 0 1 0 4-4a3.91 3.91 0 0 0-2 .56v-1.19A8.2 8.2 0 0 1 12 4a8.2 8.2 0 0 1 8 8.37v1.19a3.91 3.91 0 0 0-2-.56a4 4 0 1 0 4 4v-4.63A10.2 10.2 0 0 0 12 2ZM6 15a2 2 0 1 1-2 2a2 2 0 0 1 2-2Zm12 4a2 2 0 1 1 2-2a2 2 0 0 1-2 2Z"/>
                                </g>
                            </g>
                        </svg> By {lastFM.song.artist} - {lastFM.song.album}
                    </p>
                )}
            </div>
        </a>
    );
};

export default MusicCard;