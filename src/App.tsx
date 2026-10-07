import { useState,useEffect } from 'react'

function App() {
  const [zipcode,setZipcode] = useState<string>("");
  const [searchDisabled,setSearchDisabled] = useState<boolean>(true);

  useEffect(()=>{
    if(zipcode.length===5){
      setSearchDisabled(false);
    }else{
      setSearchDisabled(true);
    }   

  },[zipcode]); 
  
  const requestWeatherData = async()=>{
    const uri:string = `https://api.zippopotam.us/us/${zipcode}`;
    try{
      const response:any = await fetch(uri);
      if(!response.ok){
        throw new Error(response);
      }
      const result = await response.json();
      console.log(result);//Getting location data
      //TODO: get result.places.latitude and longitude. feed those into open-meteo api to get weather reports for the specified region.
    }catch (err:any){
      console.error(err.message);
    }
    
    console.log(`requesting data for ${zipcode}`);
  }
  


  return (
    <div className="shell">
      <aside className="sidebar">Weather</aside>
      <main className="panel">        
        <div style={{display:"flex",width:"100%"}}>
          <h1 style={{paddingRight:"75%"}}>WEATHERMAN</h1>
          <p style={{paddingRight:"5px"}}>Zipcode</p>  
          <input value={zipcode} onChange={(e)=>setZipcode(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="enter zipcode" type="text" style={{height:"75%", position:"relative",top:"15px"}}></input>
          <button onClick={()=>requestWeatherData()} style={{height:"75%", position:"relative",top:"15px"}} disabled={searchDisabled}>update</button>
        </div>              
      </main>      
    </div>    
  )
}

export default App
