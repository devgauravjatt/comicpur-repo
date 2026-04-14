// oxlint-disable no-unused-vars
import translate from 'google-translate-api-x';

export async function translateComicTitle(comicTitle: string) {
  try {
    const res = await translate(comicTitle, { from: 'en', to: 'hi', autoCorrect: true });
    return res.text ? `${comicTitle} - ${res.text}` : comicTitle;
  } catch (_error) {
    return comicTitle;
  }
}
