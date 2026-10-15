import type {News} from '../src/Types'
export function NewsCard({news}:{news:News}){
    const { url, title, description, publishedTime, image} = news;
    return (
        <div style={{
                display:"flex",
                flexDirection:"column",
                flexShrink:0,
                alignItems:"center",                
                borderRadius:"5px",
                boxShadow:"0 4px 12px rgba(0,0,0,0.75)",
                outlineColor:"rgb(77, 133, 185)",
                outlineStyle:"solid",
                width:"200px",
                height:"100%",
                backgroundColor:"rgb(23, 76, 126)",
                boxSizing:"border-box",
                textAlign:"center"
            }}>
            <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={image} alt={title} style={{width:"100%"}} />
            </a>
            <h2>{title}</h2>
            <p>{description}</p>
        </div>        
    )
}

export default NewsCard