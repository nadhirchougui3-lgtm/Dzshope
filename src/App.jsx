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
import OrderSuccessPage from './OrderSuccessPage'
import SignUp from './SignUp'
import LoginPage from './LoginPage'
import ContactPage from './ContactPage'
import PrivateRoute from './PrivateRoute'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'

function App() {
return ( <BrowserRouter> <AuthProvider> <CartProvider> <div className="d-flex flex-column min-vh-100"> <Navbar />

        <main className="dz-main-content flex-grow-1">
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

            <Route
              path="/commande/:id"
              element={
                <PrivateRoute>
                  <OrderSuccessPage />
                </PrivateRoute>
              }
            />

            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/admin"
              element={
                <PrivateRoute role="admin">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="commandes" element={<AdminOrders />} />
              <Route path="produits" element={<AdminProducts />} />
            </Route>

            <Route
              path="*"
              element={
                <div className="dz-not-found-route">
                  <h1>404</h1>
                  <h2>Page Not Found</h2>
                  <p>
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

export default App
