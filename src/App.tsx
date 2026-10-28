import { useState,useEffect,useRef } from 'react';
import type {Location,Weather,News} from './Types.ts';
import {ZipcodeHeader} from '../Components/ZipcodeHeader';
import {Outlet,NavLink} from 'react-router'

function App() {
  const [zipcode,setZipcode] = useState<string>("");
  const [searchDisabled,setSearchDisabled] = useState<boolean>(true);
  const [location,setLocation] = useState<Location>();
  const [currentWeather,setCurrentWeather] = useState<Weather>();
  const [dailyWeather,setDailyWeather] = useState<Weather[]|undefined>([]);
  const [hourlyWeather,setHourlyWeather] = useState<Weather[]|undefined>([]);
  const [lastUpdated,setLastUpdated] = useState<string>();
  const [requestError,setRequestError] = useState<string>();
  const [newsData,setNewsData] = useState<News[]|undefined>(); 
  const weatherController = useRef<AbortController|undefined>(undefined) 
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
    if(weatherController.current) weatherController.current.abort();
    weatherController.current = new AbortController();  
    retrieveForecast(weatherController.current);
    retrieveLocalNews(weatherController.current);
    return ()=>{
      if(weatherController.current) weatherController.current.abort();
    }
  },[location]);

  //updates weather for current location every 5 minutes
  useEffect(()=>{   
      const requestWeatherInterval = ()=>{        
        if(!location) return;               
        weatherController.current = new AbortController();    
        retrieveForecast(weatherController.current);
        retrieveLocalNews(weatherController.current);
      }   
      
      const cancelInterval = setInterval(requestWeatherInterval,1000*60*5);
      return ()=>{
        if(weatherController.current) weatherController.current.abort();
        clearInterval(cancelInterval);
      }
  },[location]);
  

  const reverseZipLookup = async(geoLocation:GeolocationPosition)=>{
    const lat = geoLocation.coords.latitude;
    const long = geoLocation.coords.longitude;
    const uri:string = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;
    try{
      const response:any = await fetch(uri);
      if(!response.ok){
        throw new Error(response);
      }
      const result = await response.json();
      setZipcode(result.postcode);
      requestLocationData(result.postcode);
    }catch(err){
      console.error(err);
    }

  }

  const requestLocationData = async(zip:string)=>{    
    setRequestError(undefined);
    const uri:string = `https://api.zippopotam.us/us/${zip}`;
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
      console.error(err);
      setLocation(undefined);
      setCurrentWeather(undefined);
      setDailyWeather([]);      
    }    
  }

  const retrieveForecast = async(controller:AbortController)=>{
    if(!location) return;
       
      const uri:string = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,wind_speed_10m_max,sunrise,sunset&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto&hourly=temperature_2m,weather_code,wind_speed_10m&forecast_hours=12`; 
      try{
        const response = await fetch(uri,{signal:controller.signal});
        if(!response.ok){
          throw new Error(response as any);
        }
        const result = await response.json();        
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

    const retrieveLocalNews = async(controller:AbortController)=>{
      if(!location) return;

      const uri = `https://freenewsapi.ai/v1/search?q=${location.county}%20${location.state}&lang=en&date=7d&sort=date&size=15`
      try{
        const response:any = await fetch(uri,{signal:controller.signal}) 
        if(!response.ok){
          throw new Error(response);
        }
        const result = await response.json();
        const newsEntries:News[] = [];
        for(const data of result.results){
          const news = {
            id:data.id,
            url:data.url,
            title:data.title,
            description:data.description,
            publishedTime:data.published_at,
            image:data.image,
          }
          newsEntries.push(news);
        }
        setNewsData(newsEntries);

      }catch(err:any){
        if(err.name==="AbortError") return;
        console.error(err);
      }
    }
  


  return (
    <div className="shell">
      <div  style={{width:"5%", display:"flex",flexDirection:"column",alignItems:'center'}}>
        <NavLink to="/" style={{ color: 'white', textDecoration: 'none' }}>Weather</NavLink>
        <NavLink to="/news" style={{ color: 'white', textDecoration: 'none' }}>News</NavLink>
      </div>
      <main className="panel">        
        <ZipcodeHeader title ="Weatherman" zipcode={zipcode} searchDisabled={searchDisabled} setZipcode={setZipcode} requestLocationData={requestLocationData}/>
        {requestError&& <h1 style={{display:"flex",flexDirection:"column",alignItems:'center',color:"rgb(255, 0, 0)"}}>Error Retrieving data: {requestError}</h1>}
        <Outlet context ={{location,currentWeather,dailyWeather,hourlyWeather,newsData}}/>        
        {lastUpdated && <>
          <div style={{display:"flex",flexDirection:"row",alignItems:'center'}}>
          <p>Last Updated: {lastUpdated}</p>
          <button onClick={()=>{
            if(weatherController.current) weatherController.current.abort();
            weatherController.current = new AbortController();
            retrieveForecast(weatherController.current);
            retrieveLocalNews(weatherController.current);}} style={{height:"50%"}}>↻</button>
          </div>
        </>}
      </main>      
    </div>    
  )
}

export default App
