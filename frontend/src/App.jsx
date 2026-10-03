import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/Auth/AuthModal';
import { PrdModal } from './components/PrdModal';
import { SEOHead } from './components/SEOHead';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const FarmProfilePage = lazy(() => import('./pages/FarmProfilePage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'));
const FarmerDashboard = lazy(() => import('./pages/FarmerDashboard'));
const DeliveryDashboard = lazy(() => import('./pages/DeliveryDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3 font-display">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-emerald-700 font-extrabold text-xs tracking-wider animate-pulse">Loading Fresh Farm Data...</p>
    </div>
  </div>
);

const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  switch (user?.role) {
    case 'Farmer':
      return <FarmerDashboard />;
    case 'Delivery':
      return <DeliveryDashboard />;
    case 'Admin':
      return <AdminDashboard />;
    case 'Customer':
    default:
      return <CustomerDashboard />;
  }
};

const ProtectedRoleRoute = ({ allowedRole, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (allowedRole === 'Customer') {
      return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <UnauthorizedPage />;
  }

  if (allowedRole && user?.role !== allowedRole && user?.role !== 'Admin') {
    return <UnauthorizedPage />;
  }

  return children;
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const isDashboardRoute = ['/dashboard', '/customer', '/farmer', '/delivery', '/admin'].some(path =>
    location.pathname.startsWith(path)
  );

  // Checkout gets minimal layout (no full navbar/footer distractions)
  const isCheckoutRoute = location.pathname.startsWith('/checkout');

  const isKnownRoute = ['/', '/products', '/farms', '/cart', '/checkout', '/order-confirmation', '/dashboard', '/customer', '/farmer', '/delivery', '/admin'].some(path =>
    location.pathname === '/' || location.pathname.startsWith(path)
  );

  const isErrorOrGatePage = location.pathname === '/404' || location.pathname === '/unauthorized' || !isKnownRoute;

  // Unauthenticated user trying to access protected dashboard route renders UnauthorizedPage
  const isProtectedGateTriggered = isDashboardRoute && !isAuthenticated;

  // Hide Navbar & Footer for Dashboards, Checkout, 404 NotFoundPage, and 403 UnauthorizedPage
  const hideNavbarAndFooter = (isDashboardRoute && isAuthenticated) || isCheckoutRoute || isErrorOrGatePage || isProtectedGateTriggered;

  return (
    <div className="min-h-screen flex flex-col bg-farmBg text-farmText font-body">
      <SEOHead />
      {!hideNavbarAndFooter && <Navbar />}

      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes — no auth required */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/farms/:id" element={<FarmProfilePage />} />
              <Route path="/cart" element={<Navigate to="/checkout" replace />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
              <Route path="/dashboard" element={<DashboardRedirect />} />
              
              {/* Role Protected Dashboard Routes */}
              <Route 
                path="/customer/*" 
                element={
                  <ProtectedRoleRoute allowedRole="Customer">
                    <CustomerDashboard setActiveView={(view) => { if (view === 'landing') navigate('/'); }} />
                  </ProtectedRoleRoute>
                } 
              />
              
              <Route 
                path="/farmer/*" 
                element={
                  <ProtectedRoleRoute allowedRole="Farmer">
                    <FarmerDashboard />
                  </ProtectedRoleRoute>
                } 
              />
              
              <Route 
                path="/delivery/*" 
                element={
                  <ProtectedRoleRoute allowedRole="Delivery">
                    <DeliveryDashboard />
                  </ProtectedRoleRoute>
                } 
              />
              
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoleRoute allowedRole="Admin">
                    <AdminDashboard />
                  </ProtectedRoleRoute>
                } 
              />

              {/* Error & Security Gate Routes (No Navbar/Footer) */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>

      {!hideNavbarAndFooter && <Footer />}
      <CartDrawer />
      <AuthModal />
      <PrdModal />
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MarketplaceProvider>
          <CartProvider>
            <MainLayout />
          </CartProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
