import { WEATHER_LABELS } from '../src/Labels';
import { weatherIconUrl } from '../src/WeatherIcons';

export function WeatherIcon({ code, size = 64, decorative = false }: {
  code: number;
  size?: number;
  decorative?: boolean;
}) {
  return (
    <img
      src={weatherIconUrl(code)}
      alt={decorative ? '' : WEATHER_LABELS[code] ?? 'Unknown weather'}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}
