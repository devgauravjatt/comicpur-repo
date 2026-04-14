// oxlint-disable no-unused-vars
import translate from 'translate';

export async function translateComicTitle(comicTitle: string) {
  try {
    const res = await translate(comicTitle, { from: 'en', to: 'hi' });
    return res ? `${comicTitle} - ${res}` : comicTitle;
  } catch (_error) {
    return comicTitle;
  }
}
