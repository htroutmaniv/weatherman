import { useState,useEffect } from 'react'
import type {Location,Weather} from './Types.ts'
import {WeatherCard} from '../Components/weatherCard'



function App() {
  const [zipcode,setZipcode] = useState<string>("");
  const [searchDisabled,setSearchDisabled] = useState<boolean>(true);
  const [location,setLocation] = useState<Location>();
  const [currentWeather,setCurrentWeather] = useState<Weather>();
  const [dailyWeather,setDailyWeather] = useState<Weather[]>([]);
  const [lastUpdated,setLastUpdated] = useState<string>();

  //updates zipcode state
  useEffect(()=>{
    if(zipcode.length===5){
      setSearchDisabled(false);
    }else{
      setSearchDisabled(true);
    }   

  },[zipcode]); 

  //fetches current weather conditions as location changes
  useEffect(()=>{
    if(!location) return;
    const uri:string = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;
    const retrieveForecast = async()=>{
      try{
        const response = await fetch(uri);
        if(!response.ok){
          throw new Error(response as any);
        }
        const result = await response.json();
        console.log(result);
        const weather:Weather = {
          temperature:result.current.temperature_2m,
          code:result.current.weather_code,
          windSpeed:result.current.wind_speed_10m,
          time:result.current.time
        }
        setCurrentWeather(weather);
        const daily:Weather[] = [];
        for(let i = 0; i<7;i++){
          const weather:Weather = {
            highTemp:result.daily.temperature_2m_max[i],
            lowTemp:result.daily.temperature_2m_min[i],
            code:result.daily.weather_code[i],
            windSpeed:result.daily.wind_speed_10m_max[i],
            time:result.daily.time[i],
          }
          daily.push(weather);
        }
        setDailyWeather(daily);
        const time = new Date(Date.now()).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
        setLastUpdated(time);
        
      }catch (err:any){
        console.error(err.message);
      }
    }
    retrieveForecast();
  },[location]);


  
  const requestWeatherData = async()=>{
    const uri:string = `https://api.zippopotam.us/us/${zipcode}`;
    try{
      const response:any = await fetch(uri);
      if(!response.ok){
        throw new Error(response);
      }
      const result = await response.json();      
      const place = result.places[0];
      const locationData:Location = {state:place.state,county:place[`place name`],lat:place.latitude,lon:place.longitude}
      setLocation(locationData);      
    }catch (err:any){
      console.error(err.message);
    }    
  }
  


  return (
    <div className="shell">
      <aside className="sidebar">Weather</aside>
      <main className="panel">        
        <div style={{display:"flex",width:"100%", marginLeft:'10px'}}>
          <h1>WEATHERMAN</h1>
          <div style={{marginLeft:'auto',display:"flex", alignItems:'center', gap:5}}>
            <p>Zipcode</p>  
            <input value={zipcode} onChange={(e)=>setZipcode(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="enter zipcode" type="text" style={{height:"25%", position:"relative"}}></input>
            <button onClick={()=>requestWeatherData()} style={{width:'150px',height:"35%", position:"relative"}} disabled={searchDisabled}>update</button>
          </div>
        </div> 
        <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:'center'}}>
          {location && <h2 >Current conditions in {location.county}, {location.state} </h2>}
          {currentWeather && <WeatherCard weather={currentWeather}></WeatherCard>}
        </div> 
          <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:'center'}}>
              {location && <p >Weekly Forecast</p>}
              <div style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"space-evenly"}}>
              {dailyWeather.length>0 &&
                dailyWeather.map((day)=>{
                  return <WeatherCard key={day.time} weather={day}/>
                })
              }
            </div>          
        </div>
        {lastUpdated&& <p>Last Updated: {lastUpdated}</p>}     
      </main>      
    </div>    
  )
}

export default App
