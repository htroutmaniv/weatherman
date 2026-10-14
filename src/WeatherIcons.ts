/** Daytime weather artwork. Exact precipitation intensity remains in WEATHER_LABELS. */
import {WEATHER_ICONS_DAY,WEATHER_ICONS_NIGHT} from './Labels'

export function weatherIconUrl(code: number,time:string,sunrise:string,sunset:string){
  const rise = new Date(sunrise).getHours();
  const set = new Date(sunset).getHours();
  const hour = new Date(time).getHours();
  const isNight = hour >= set || hour<rise;  
  let name;
  if(isNight){
    name = Object.hasOwn(WEATHER_ICONS_NIGHT, code) ? WEATHER_ICONS_NIGHT[code] : 'unknown';
  }else{
    name = Object.hasOwn(WEATHER_ICONS_DAY, code) ? WEATHER_ICONS_DAY[code] : 'unknown';
  }
  return `${import.meta.env.BASE_URL}weather/${name}.svg`;
}
