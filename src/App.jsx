import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'

import Navbar from './navbar'
import Footer from './footer'
import LandingPage from './LandingPage'
import ProductsPage from './ProductsPage'
import ProductDetailPage from './ProductDetailPage'
import CategoriesPage from './CategoriesPage'
import CartPage from './CartPage'
import CheckoutPage from './CheckoutPage'
import SignUp from './SignUp'
import LoginPage from './LoginPage'
import ContactPage from './ContactPage'
import PrivateRoute from './PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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

                <Route
                  path="/checkout"
                  element={
                    <PrivateRoute>
                      <CheckoutPage />
                    </PrivateRoute>
                  }
                />

                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/contact" element={<ContactPage />} />

                <Route
                  path="*"
                  element={
                    <div className="text-center py-5">
                      <h1>404 - Page Not Found</h1>
                      <p className="text-muted">
                        The page you are looking for does not exist.
                      </p>
                    </div>
                  }
                />

              </Routes>
            </main>

            <Footer />

          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App ;