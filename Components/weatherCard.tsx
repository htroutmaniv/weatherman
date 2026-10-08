import type {Weather} from '../src/Types'
import {WEATHER_LABELS} from '../src/Labels'

export function WeatherCard({weather}:{weather:Weather}) { 
   
 
  return (
        <div>
            {weather &&
              <>
                <p>Temperature: {weather.temperature}F</p>
                <p>Conditions: {WEATHER_LABELS[weather.code]}</p>
                <p>Wind speed: {weather.windSpeed} MPH</p>
              </>            
            }
        </div>   
  )
}

export default WeatherCard