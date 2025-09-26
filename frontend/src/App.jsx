import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';
import LoginPage from './Pages/LoginPage/LoginPage';
import Profile from './Pages/Profile/Profile';
import UrlShortner from './Pages/UrlShortner/UrlShortner';
import MyUrls from './Pages/MyUrls/MyUrls';
import './index.css';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu';
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
export default function App() {
  return <MantineProvider>{
     <Router>
        <HeaderMegaMenu/>
        <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<LoginPage/>} />
            <Route element={<PrivateRoute/>}>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/url' element={<UrlShortner/>}></Route>
            <Route path='/myurls' element={<MyUrls/>}></Route>
            </Route>
        </Routes>
    </Router>
    }</MantineProvider>;
}


