import type {Weather} from '../src/Types'
import {WeatherCard} from './weatherCard'

export function HourlyWeather({hourlyWeather}:{hourlyWeather:Weather[]|undefined}){
    return (
        <>
        <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:'center'}}>
              <h1 >Hourly Forecast</h1>
              <div style={{display:"flex",flexDirection:"row",flexWrap:"nowrap",gap:12,overflowX:"auto",width:"100%",justifyContent:"space-evenly",padding:"12px 0"}}>
                {hourlyWeather && hourlyWeather.length>0 &&
                  hourlyWeather.map((hour)=>{
                    return <WeatherCard key={hour.time} weather={hour} hideSunCycle={true}/>
                  })
                }
              </div>          
          </div>         
        </>
    )
    

}

export default HourlyWeather