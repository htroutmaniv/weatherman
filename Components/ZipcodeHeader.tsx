type ZipToolbarProps = {
    title: string;
    zipcode: string;
    searchDisabled: boolean;
    setZipcode: (value:string)=>void;
    requestLocationData: (value:string)=>void;
}

export function ZipcodeHeader({title,zipcode,searchDisabled,setZipcode,requestLocationData}:ZipToolbarProps){


    return(
    <div style={{display:"flex",width:"95%", marginLeft:'12px'}}>
          <h1>{title}</h1>
          <div style={{marginLeft:'auto',display:"flex", alignItems:'center', gap:5}}>
            <p>Zipcode</p>  
            <input value={zipcode} onChange={(e)=>setZipcode(e.target.value.replace(/\D/g,'').slice(0,5))} placeholder="enter zipcode" type="text" style={{height:"25%", position:"relative"}}></input>
            <button onClick={()=>requestLocationData(zipcode)} style={{width:'150px',height:"35%", position:"relative"}} disabled={searchDisabled}>update</button>
          </div>
    </div> )
}

export default ZipcodeHeader;