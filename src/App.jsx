import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './CartContext'

import Navbar from './navbar'
import LandingPage from './LandingPage'
import ProductsPage from './ProductsPage'
import ProductDetailPage from './ProductDetailPage'
import CartPage from './CartPage'
import CheckoutPage from './CheckoutPage'
import Footer from './footer'
import SignUp from './SignUp'
import ContactPage from './ContactPage'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>

        <div className="d-flex flex-column min-vh-100">

          <Navbar />

          <main className="flex-grow-1">
            <Routes>

              <Route
                path="/"
                element={<LandingPage />}
              />

              <Route
                path="/produits"
                element={<ProductsPage />}
              />

              <Route
                path="/produit/:id"
                element={<ProductDetailPage />}
              />

              <Route
                path="/contact"
                element={<ContactPage />}
              />

              <Route
                path="/panier"
                element={<CartPage />}
              />

              <Route
                path="/checkout"
                element={<CheckoutPage />}
              />

              <Route
                path="/SignUp"
                element={<SignUp />}
              />

            </Routes>
          </main>

          <Footer />

        </div>

      </BrowserRouter>
    </CartProvider>
  )
}

export default App ;