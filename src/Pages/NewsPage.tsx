import {useOutletContext} from 'react-router';
import {NewsCard} from '../../Components/NewsCard';
import type {News} from '../Types';

type NewsPageContext = {
    newsData:News[]|undefined;
}

export function NewsPage(){

    const {newsData} = useOutletContext<NewsPageContext>();

    return (        
        <div style={{display:"flex",flexDirection:"column",alignItems:'center'}}>
          <h1 >Local News</h1>          
          <div style={{display:"flex",flexDirection:"row",flexWrap:"nowrap",gap:12,overflowX:"auto",width:"95%",justifyContent:"space-evenly",padding:"12px 12px"}}>
            {newsData && newsData.map((entry)=>{
              return <NewsCard key={entry.id} news={entry}/>
              
            })}
          </div>          
        </div>         
    )
}

export default NewsPage;