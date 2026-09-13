import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Navbar from './navbar';
import LandingPage from './LandingPage';
import ProductsPage from './ProductsPage';
import ProductDetailPage from './ProductDetailPage';
import CartPage from './CartPage';
import Footer from './footer'

function App() { 
  return (
    <>
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/produits' element={<ProductsPage />} />
          <Route path='/produit/:id' element={<ProductDetailPage />} />
          <Route path='/panier' element={<CartPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
    </>
  );
}

export default App;
