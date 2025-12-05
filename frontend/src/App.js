import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Categories from './pages/Categories/Categories';
import Nouveautes from './pages/Nouveautes/Nouveautes';
import Promotions from './pages/Promotions/Promotions';
import Products from './pages/Products/Products';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Login from './pages/Login/Login';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import MyOrders from './pages/MyOrders/MyOrders';
import Profile from './pages/Profile/Profile';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/nouveautes" element={<Nouveautes />} />
                <Route path="/promotions" element={<Promotions />} />
                <Route path="/produits" element={<Products />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/connexion" element={<Login />} />
                <Route path="/commander" element={<Checkout />} />
                <Route path="/commande-confirmee/:id" element={<OrderConfirmation />} />
                <Route path="/mes-commandes" element={<MyOrders />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/admin/*" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer
              position="top-right"
              autoClose={1800}
              hideProgressBar={false}
              closeOnClick
              pauseOnHover={false}
            />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
