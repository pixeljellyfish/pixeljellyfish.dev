import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { getFileType, getFileTypeIcon } from "../utils/fileTypeMappings";

const DiscordStatus = () => {
  const [fileName, setFileName] = useState<string>("");
  const [fileType, setFileType] = useState<string>("");
  const [timestamps, setTimestamps] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [hasValidActivity, setHasValidActivity] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiscordStatus = async () => {
      try {
        const userIds = ["454648470012166155", "746276722902695957"];

        const responses = await Promise.all(
          userIds.map((id) =>
            axios
              .get(`https://api.lanyard.rest/v1/users/${id}`)
              .catch((error: unknown): AxiosResponse | null => {
                console.error(`Error fetching status for user ${id}:`, error);
                return null;
              })
          )
        );

        setHasValidActivity(false);

        for (const response of responses) {
          if (!response || !response.data?.data?.activities) {
            continue;
          }

          const { data } = response.data;
          const vsCodeActivity = data.activities.find(
            (activity: { name: string }) =>
              activity.name === "Visual Studio Code"
          );

          if (vsCodeActivity && vsCodeActivity.timestamps?.start) {
            console.log(
              "Details:",
              vsCodeActivity.details,
              "State:",
              vsCodeActivity.state
            );
            // Extract filename, line, and column from state
            const fileNameMatch = vsCodeActivity.state?.match(
              /Working on (.+?)(?::(\d+):(\d+))?$/
            );
            const candidateFileName = fileNameMatch
              ? fileNameMatch[1]
              : "Unknown File";
            // Validate filename has an extension
            const isValidFileName = /\.\w+$/.test(candidateFileName);
            if (isValidFileName) {
              setHasValidActivity(true);
              setFileName(candidateFileName);
              // Get language and optionally add line/column
              const language = getFileType(candidateFileName);
              const line = fileNameMatch?.[2];
              const column = fileNameMatch?.[3];
              const fileTypeDisplay =
                line && column
                  ? `${language} - Line ${line}, Column ${column}`
                  : language;
              setFileType(fileTypeDisplay);
              setTimestamps({
                start: vsCodeActivity.timestamps.start || 0,
                end: vsCodeActivity.timestamps.end || 0,
              });
              return;
            }
          }
        }

        setHasValidActivity(false);
      } catch (error) {
        console.error("Error fetching Discord status:", error);
        setHasValidActivity(false);
      }
    };

    fetchDiscordStatus();
    const interval = setInterval(fetchDiscordStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const formatElapsedTime = (start: number): string => {
    const totalSeconds = Math.floor((Date.now() - start) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  if (!hasValidActivity) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4 p-2 rounded-lg bg-transparent border border-gray-800 dark:border-gray-400 shadow-md max-w-sm transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
      <div className="w-12 h-12 flex-shrink-0">
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/nolan/48/visual-studio-code-2019.png"
          alt="visual-studio-code-2019"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-indigo-400 truncate">
          {fileName}
        </h2>
        <p className="text-xs text-rose-300 flex items-center">
          {getFileTypeIcon(fileName)}
          {fileType}
        </p>
        <p className="text-xs text-teal-300">
          Editing for {formatElapsedTime(timestamps.start)}
        </p>
      </div>
    </div>
  );
};

export default DiscordStatus;
