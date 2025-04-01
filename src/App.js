// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './pages/AddProduct';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import ViewProducts from './pages/ViewProducts';
import SellerDashboard from './pages/SellerDashboard';
import SellerLogin from './pages/SellerLogin';
import SellerRegister from './pages/SellerRegister';
import PlaceBid from './pages/PlaceBid';

function App() {
    return (
        <Router>
            <div>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/add-product" element={<AddProduct />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/auctions" element={<ViewProducts />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard />} />
                    <Route path="/seller-login" element={<SellerLogin />} />
                    <Route path="/seller-register" element={<SellerRegister />} />
                    <Route path="/place-bid/:id" element={<PlaceBid />} />
                </Routes>
                <Footer />
            </div>
        </Router>
    );
}

export default App;