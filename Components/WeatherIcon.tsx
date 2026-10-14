import { WEATHER_LABELS } from '../src/Labels';
import { weatherIconUrl } from '../src/WeatherIcons';
import type {Weather} from '../src/Types'

export function WeatherIcon({ weather ,size = 64, decorative = false }: {
  weather: Weather;  
  size?: number;
  decorative?: boolean;
}) {
  const {code, time, sunrise, sunset} = weather;
  return (
    <img
      src={weatherIconUrl(code,time,sunrise,sunset)}
      alt={decorative ? '' : WEATHER_LABELS[code] ?? 'Unknown weather'}
      width={size}
      height={size}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    />
  );
}
