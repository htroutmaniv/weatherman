import type {Weather} from '../src/Types'
import {WEATHER_LABELS} from '../src/Labels'
import {WeatherIcon} from './WeatherIcon'
import {hourMin, dayLabel} from '../src/TimeUtilities'


export function WeatherCard({weather,hideSunCycle=false,}:{weather:Weather;hideSunCycle?:boolean}) {   
 
  return (
        <div style={{
                display:"flex",
                flexDirection:"column",
                flexShrink:0,
                alignItems:"center",                
                borderRadius:"5px",
                boxShadow:"0 4px 12px rgba(0,0,0,0.75)",
                outlineColor:"rgb(77, 133, 185)",
                outlineStyle:"solid",
                width:"200px",
                height:"100%",
                backgroundColor:"rgb(23, 76, 126)",
                boxSizing:"border-box"
            }}>
            {weather &&
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",}}>
                <h1 style={{margin:0}}>{dayLabel(weather.time,weather.timeType)}</h1>
                <WeatherIcon weather={weather}/>
                {weather.temperature && <p>Temperature: {weather.temperature}F</p>}
                {weather.highTemp && <p  style={{margin:5}}>High: {weather.highTemp}</p>}
                {weather.lowTemp && <p  style={{margin:5}}>Low: {weather.lowTemp}</p>}
                <p style={{ margin: 1 }}>Conditions: {WEATHER_LABELS[weather.code]}</p>
                <p style={{ margin: 1 }}>Wind speed: {weather.windSpeed} MPH</p>
                {!hideSunCycle && <p style={{ margin: 1 }}>Sunrise: {hourMin(weather.sunrise)}</p>}
                {!hideSunCycle && <p style={{ margin: 1 }}>Sunset: {hourMin(weather.sunset)}</p>}
              </div>            
            }
        </div>   
  )
}

export default WeatherCard
