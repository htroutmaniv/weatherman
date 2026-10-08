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
  time:string
}