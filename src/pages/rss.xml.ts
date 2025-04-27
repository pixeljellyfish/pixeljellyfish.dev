import rss from '@astrojs/rss';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
    return rss({
        title: 'pixeljellyfish',
        description: 'pixeljellyfish is a developer from Brisbane Australia.',
        site: "https://pixeljellyfish.dev",
        items: [],
        customData: `<language>en-us</language>`,
    });
}