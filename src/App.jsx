
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { AuthProvider } from './AuthContext'
import { FavoritesProvider } from './FavoritesContext'

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
import FavoritesPage from './FavoritesPage'
import PrivateRoute from './PrivateRoute'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AdminUsers from './pages/admin/AdminUsers'

function StoreLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="dz-main-content flex-grow-1">
        {children}
      </main>

      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <Routes>
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
                <Route path="utilisateurs" element={<AdminUsers />} />
              </Route>

              <Route
                path="/"
                element={
                  <StoreLayout>
                    <LandingPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/produits"
                element={
                  <StoreLayout>
                    <ProductsPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/produit/:id"
                element={
                  <StoreLayout>
                    <ProductDetailPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/categories"
                element={
                  <StoreLayout>
                    <CategoriesPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/favoris"
                element={
                  <StoreLayout>
                    <FavoritesPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/panier"
                element={
                  <StoreLayout>
                    <CartPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/checkout"
                element={
                  <PrivateRoute>
                    <StoreLayout>
                      <CheckoutPage />
                    </StoreLayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/commande/:id"
                element={
                  <PrivateRoute>
                    <StoreLayout>
                      <OrderSuccessPage />
                    </StoreLayout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/signup"
                element={
                  <StoreLayout>
                    <SignUp />
                  </StoreLayout>
                }
              />

              <Route
                path="/login"
                element={
                  <StoreLayout>
                    <LoginPage />
                  </StoreLayout>
                }
              />

              <Route
                path="/contact"
                element={
                  <StoreLayout>
                    <ContactPage />
                  </StoreLayout>
                }
              />

              <Route
                path="*"
                element={
                  <StoreLayout>
                    <div className="dz-not-found-route">
                      <h1>404</h1>
                      <h2>Page Not Found</h2>
                      <p>
                        The page you are looking for does not exist.
                      </p>
                    </div>
                  </StoreLayout>
                }
              />
            </Routes>
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App