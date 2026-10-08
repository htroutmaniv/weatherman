import type {Weather} from '../src/Types'
import {WEATHER_LABELS} from '../src/Labels'
import {WeatherIcon} from './WeatherIcon'


export function WeatherCard({weather}:{weather:Weather}) { 

    const dayLabel = (time:string)=>{
        const day = new Date(`${time}T00:00:00`).toLocaleDateString(undefined, {weekday:'long'})
        return day==="Invalid Date" ? "Current":day;

    }
   
 
  return (
        <div style={{
                display:"flex",
                flexDirection:"column",
                alignItems:"center",                
                borderRadius:"5px",
                boxShadow:"0 4px 12px rgba(0,0,0,0.75)",
                outlineColor:"rgb(77, 133, 185)",
                outlineStyle:"solid",
                width:"10%",
                backgroundColor:"rgb(23, 76, 126)"
            }}>
            {weather &&
              <>
                <h1>{dayLabel(weather.time)}</h1>
                <WeatherIcon code={weather.code}/>
                {weather.temperature && <p>Temperature: {weather.temperature}F</p>}
                {weather.highTemp && <p>High: {weather.highTemp}</p>}
                {weather.lowTemp && <p>High: {weather.lowTemp}</p>}
                <p>Conditions: {WEATHER_LABELS[weather.code]}</p>
                <p>Wind speed: {weather.windSpeed} MPH</p>
              </>            
            }
        </div>   
  )
}

export default WeatherCard
