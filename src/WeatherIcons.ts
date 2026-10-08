/** Daytime weather artwork. Exact precipitation intensity remains in WEATHER_LABELS. */
import {WEATHER_ICONS} from './Labels'

export function weatherIconUrl(code: number): string {
  const name = Object.hasOwn(WEATHER_ICONS, code) ? WEATHER_ICONS[code] : 'unknown';
  return `${import.meta.env.BASE_URL}weather/${name}.svg`;
}
