import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function get(context: any) {
    return rss({
        title: 'pixeljellyfish',
        description: 'pixeljellyfish is a developer from Brisbane Australia.',
        site: "https://pixeljellyfish.dev",
        items: await pagesGlobToRssItems(import.meta.glob('./index/*.md')),
        customData: `<language>en-us</language>`,
    });
}