import { useState,useEffect,useRef } from 'react'
import type {Location,Weather} from './Types.ts'
import {WeatherCard} from '../Components/weatherCard'
import {WeeklyWeather} from '../Components/WeeklyWeather'
import {HourlyWeather} from '../Components/HourlyWeather'



function App() {
  const [zipcode,setZipcode] = useState<string>("");
  const [searchDisabled,setSearchDisabled] = useState<boolean>(true);
  const [location,setLocation] = useState<Location>();
  const [currentWeather,setCurrentWeather] = useState<Weather>();
  const [dailyWeather,setDailyWeather] = useState<Weather[]|undefined>([]);
  const [hourlyWeather,setHourlyWeather] = useState<Weather[]|undefined>([]);
  const [lastUpdated,setLastUpdated] = useState<string>();
  const [requestError,setRequestError] = useState<string>();  
  const abortRef = useRef<AbortController|null>(null);

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(reverseZipLookup,()=>console.error(`reverse lookup of position failed`));
  },[])


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
    retrieveForecast();
    
  },[location]);

  //updates weather for current location every 5 minutes
  useEffect(()=>{   
      const requestWeatherInterval = ()=>{        
        if(!location) return;                  
        retrieveForecast();
      }   

      const cancelInterval = setInterval(requestWeatherInterval,1000*60*5);
      return ()=>clearInterval(cancelInterval);
  },[location]);
  

  const reverseZipLookup = async(geoLocation:GeolocationPosition)=>{
    const lat = geoLocation.coords.latitude;
    const long = geoLocation.coords.longitude;
    console.log(`lat:${lat}, long:${long}`);

    const uri:string = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;

    try{
      const response:any = await fetch(uri);
      if(!response.ok){
        throw new Error(response);
      }
      const result = await response.json();
      console.log(result);
      //setZipcode(result.postcode);
      const locationData:Location = {state:result.principalSubdivision,county:result.locality,lat:result.latitude,lon:result.longitude};
      setLocation(locationData)

    }catch(err){
      console.error(err);
    }

  }

  const requestLocationData = async()=>{
    setRequestError(undefined);
    const uri:string = `https://api.zippopotam.us/us/${zipcode}`;
    if(abortRef.current) abortRef.current.abort();
    const controller:AbortController = new AbortController();
    abortRef.current = controller;
    try{
      const response:any = await fetch(uri,{signal:controller.signal});
      if(!response.ok){
        throw new Error(response);
      }
      const result = await response.json();      
      const place = result.places[0];
      const locationData:Location = {state:place.state,county:place[`place name`],lat:place.latitude,lon:place.longitude}
      setLocation(locationData);      
    }catch (err:any){
      if(err.name === 'AbortError') return;
      setRequestError('Bad zipcode');
      console.warn(`zipcode: ${zipcode}`);
      console.error(err.message);
      setLocation(undefined);
      setCurrentWeather(undefined);
      setDailyWeather([]);      
    }    
  }

  const retrieveForecast = async()=>{
    if(!location) return;
    const controller:AbortController = new AbortController();  
      const uri:string = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_hours=12`; 
      try{
        const response = await fetch(uri,{signal:controller.signal});
        if(!response.ok){
          throw new Error(response as any);
        }
        const result = await response.json();
        console.log(result);
        const sunrise = result.daily.sunrise[0];
        const sunset = result.daily.sunset[0];
        //current weather
        const weather:Weather = {
          temperature:result.current.temperature_2m,
          code:result.current.weather_code,
          windSpeed:result.current.wind_speed_10m,
          time:result.current.time,
          timeType:"current",
          sunrise:sunrise,
          sunset:sunset
        }
        setCurrentWeather(weather);
        //daily weather
        const daily:Weather[] = [];
        for(let i = 0; i<7;i++){
          const weather:Weather = {
            highTemp:result.daily.temperature_2m_max[i],
            lowTemp:result.daily.temperature_2m_min[i],
            code:result.daily.weather_code[i],
            windSpeed:result.daily.wind_speed_10m_max[i],
            time:result.daily.time[i],
            timeType:"daily",
            sunrise:result.daily.sunrise[i],
            sunset:result.daily.sunset[i],
          }
          daily.push(weather);
        }        
        setDailyWeather(daily);
        //hourly weather
        const hourData=result.hourly;
        const hourly:Weather[] = [];
        for(let i = 0; i<hourData.time.length;i++){
          const weather:Weather = {
            temperature:hourData.temperature_2m[i],
            code:hourData.weather_code[i],
            windSpeed:hourData.wind_speed_10m[i],
            time:hourData.time[i],
            timeType:"hourly",
            sunrise:sunrise,
            sunset:sunset,
          }
          hourly.push(weather);
        }
        setHourlyWeather(hourly);
        //set updated time
        const time = new Date(Date.now()).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        });
        setLastUpdated(time);
        console.log(`${time}`);
        
      }catch (err:any){    
        if(err.name === 'AbortError') return;    
        setRequestError('Weather data could not be retrieved for this location');
        console.error(err);
        setLocation(undefined);
        setCurrentWeather(undefined);
        setDailyWeather([]);
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
            <button onClick={()=>requestLocationData()} style={{width:'150px',height:"35%", position:"relative"}} disabled={searchDisabled}>update</button>
          </div>
        </div> 
        {requestError&& <h1 style={{display:"flex",flexDirection:"column",alignItems:'center',color:"rgb(255, 0, 0)"}}>Error Retrieving data: {requestError}</h1>}
        <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:'center'}}>
          {location && <h2 >Current conditions in {location.county}, {location.state} </h2>}
          {currentWeather && <WeatherCard weather={currentWeather}></WeatherCard>}
        </div> 
        {location && <HourlyWeather hourlyWeather={hourlyWeather}/>}
        {location && <WeeklyWeather dailyWeather={dailyWeather}/>}
        {lastUpdated && <>
          <div style={{display:"flex",flexDirection:"row",alignItems:'center'}}>
          <p>Last Updated: {lastUpdated}</p>
          <button onClick={()=>retrieveForecast()} style={{height:"50%"}}>↻</button>
          </div>
        </>} 
      </main>      
    </div>    
  )
}

export default App
