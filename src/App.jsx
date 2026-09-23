import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './CartContext'

import Navbar from './navbar'
import Footer from './footer'
import LandingPage from './LandingPage'
import ProductsPage from './ProductsPage'
import ProductDetailPage from './ProductDetailPage'
import CategoriesPage from './CategoriesPage'
import CartPage from './CartPage'
import CheckoutPage from './CheckoutPage'
import SignUp from './SignUp'
import ContactPage from './ContactPage'

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="d-flex flex-column min-vh-100">
          
          <Navbar />

          <main className="flex-grow-1 container py-4">
            <Routes>

              <Route path="/" element={<LandingPage />} />

              <Route path="/produits" element={<ProductsPage />} />
              <Route path="/produit/:id" element={<ProductDetailPage />} />
              <Route path="/categories" element={<CategoriesPage />} />

              <Route path="/panier" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />

              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route path="*" element={
                <div className="text-center py-5">
                  <h1>404 - Page Non Trouvée</h1>
                  <p className="text-muted">La page que vous cherchez n'existe pas.</p>
                </div>
              } />

            </Routes>
          </main>

          <Footer />

        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App ;