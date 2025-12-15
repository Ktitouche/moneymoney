import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

// Scroll to top on route change (works well on mobile)
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    const scrollNow = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      } catch (_) {
        window.scrollTo(0, 0);
      }
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };
    scrollNow();
    const t = setTimeout(scrollNow, 0);
    return () => clearTimeout(t);
  }, [location.pathname, location.search]);
  return null;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
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
