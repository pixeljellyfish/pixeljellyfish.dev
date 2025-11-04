import React from 'react';
import { SiAstro, SiTypescript, SiJavascript, SiPython, SiHtml5, SiCss3 } from 'react-icons/si';
import { VscCode } from 'react-icons/vsc';

// Map file extensions to language names
export const extensionMap: { [key: string]: string } = {
    astro: 'Astro',
    ts: 'TypeScript',
    tsx: 'TypeScript',
    js: 'JavaScript',
    jsx: 'JavaScript',
    py: 'Python',
    html: 'HTML',
    css: 'CSS',
    go: 'Go',
    java: 'Java',
    c: 'C',
    cpp: 'C++',
    rb: 'Ruby',
    php: 'PHP',
    sh: 'Shell Script',
    json: 'JSON',
    xml: 'XML',
    yml: 'YAML',
    md: 'Markdown',
    sql: 'SQL',
    dockerfile: 'Dockerfile',
    log: 'Log',
    txt: 'Text',
    svg: 'SVG',
    png: 'Image',
    jpg: 'Image',
    ico: 'Image',
};

// Map file extensions to icon components
export const iconMap: { [key: string]: JSX.Element } = {
    astro: <SiAstro className="inline-block w-4 h-4 mr-1" />,
    ts: <SiTypescript className="inline-block w-4 h-4 mr-1" />,
    tsx: <SiTypescript className="inline-block w-4 h-4 mr-1" />,
    js: <SiJavascript className="inline-block w-4 h-4 mr-1" />,
    jsx: <SiJavascript className="inline-block w-4 h-4 mr-1" />,
    py: <SiPython className="inline-block w-4 h-4 mr-1" />,
    html: <SiHtml5 className="inline-block w-4 h-4 mr-1" />,
    css: <SiCss3 className="inline-block w-4 h-4 mr-1" />,
};

// Function to get file type from filename
export const getFileType = (fileName: string): string => {
    const rawExt = fileName.split('.').pop();
    const extension = rawExt ? rawExt.toLowerCase() : '';
    return extensionMap[extension] || 'Unknown';
};
// Function to get file type icon from filename
export const getFileTypeIcon = (fileName: string): JSX.Element => {
    const rawExt = fileName.split('.').pop();
    const extension = rawExt ? rawExt.toLowerCase() : '';
    return iconMap[extension] || <VscCode className="inline-block w-4 h-4 mr-1" />;
}