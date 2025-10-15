import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from './home/home';
import Header from './header/header';
import CreateUser from './create/create';
import SighIn from './sighin/sighin';
import ServiceContents from './components/serviceContent/Contents';


function App() {
  return (
    <div>
      <Router>
      <Header/>
      <div style={{ paddingTop: '80px' }}>
      <Routes>
        <Route path='/home' element={<Home/>}/>
        
        <Route path='/signin' element={<SighIn/>}/>

        <Route path='/create' element={<CreateUser/>}/>

        <Route path='/contents' element={<ServiceContents/>}/>

      </Routes>
      </div>
      </Router>
    </div>
  );
}

export default App;
