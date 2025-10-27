import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from './home/home';
import Header from './header/header';
import CreateUser from './create/create';
import SighIn from './sighin/sighin';
import ServiceContents from './components/serviceContent/Contents';
import { CartProvider } from './components/serviceContent/CartProvoider';
import WorkCart from './components/workCart/workCart';
import { UserProvider } from './components/userContext/userContext';

function App() {
  return (
    <UserProvider>     {/* ✅ Wrap with UserProvider */}
      <CartProvider>   {/* ✅ Then wrap with CartProvider */}
        <Router>
          <Header />
          <div style={{ paddingTop: '80px' }}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/signin" element={<SighIn />} />
              <Route path="/create" element={<CreateUser />} />
              <Route path="/contents" element={<ServiceContents />} />
              <Route path="/cart" element={<WorkCart />} />
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
