import {useOutletContext} from 'react-router';
import {WeatherCard} from '../../Components/weatherCard';
import {WeeklyWeather} from '../../Components/WeeklyWeather';
import {HourlyWeather} from '../../Components/HourlyWeather';
import type {Location,Weather} from '../Types'
type WeatherPageContext = {
    location:Location|undefined;
    currentWeather:Weather|undefined;
    dailyWeather: Weather[]|undefined;
    hourlyWeather: Weather[]|undefined;
}

export function WeatherPage(){
    const {location,currentWeather,dailyWeather,hourlyWeather} = useOutletContext<WeatherPageContext>();
    return (
        <>
            <div style={{display:"flex",flexDirection:"column",width:"100%",alignItems:'center'}}>
                {location && <h2 >Current conditions in {location.county}, {location.state} </h2>}
                {currentWeather && <WeatherCard weather={currentWeather}></WeatherCard>}
            </div> 
            {location && <HourlyWeather hourlyWeather={hourlyWeather}/>}
            {location && <WeeklyWeather dailyWeather={dailyWeather}/>}
        </>
    )
}

export default WeatherPage;