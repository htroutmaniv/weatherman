import type {Weather} from '../src/Types'
import {WeatherCard} from './weatherCard'

export function WeeklyWeather({dailyWeather}:{dailyWeather:Weather[]|undefined}){
    return (
        <>
        <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:'center'}}>
              <h1 >Weekly Forecast</h1>
              <div style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-evenly"}}>
                {dailyWeather && dailyWeather.length>0 &&
                  dailyWeather.map((day)=>{
                    return <WeatherCard key={day.time} weather={day}/>
                  })
                }
              </div>          
          </div>        
        </>
    )
    

}

export default WeeklyWeather