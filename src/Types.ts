export type Location = {
  state:string,
  county:string,
  lat:string,
  lon:string
}
export type Weather = {
  temperature?:number,
  highTemp?:number,
  lowTemp?:number,
  code:number,
  windSpeed:number,
  time:string,
  timeType:string
  sunrise:string,
  sunset:string
}
export type News = {
  id:string,
  url:string,
  title:string,
  description:string,
  publishedTime:string,
  image:string,
}