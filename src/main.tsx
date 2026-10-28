import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router'
import {WeatherPage} from './Pages/WeatherPage';
import {NewsPage} from './Pages/NewsPage';
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root');
if (!root) throw new Error('root element missing');
ReactDOM.createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}>
          <Route index element ={<WeatherPage/>}/>
          <Route path="news" element={<NewsPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
