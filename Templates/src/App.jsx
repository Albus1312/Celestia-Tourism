import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';

import AdminLayout from './layouts/AdminLayout';
import DestinationsPage from './pages/admin/DestinationsPage';
import LandingPageBuilder from './pages/admin/LandingPageBuilder';
import BookingPage from './pages/admin/BookingPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersPage from './pages/admin/UsersPage';
import CategoriesPage from './pages/admin/CategoriesPage';
import TourPackagesPage from './pages/admin/TourPackagesPage';
import LocalServicesPage from './pages/admin/LocalServicesPage';
import HomePage from './pages/customer/HomePage';
import DestinationsListPage from './pages/customer/DestinationsListPage';
import DestinationDetailPage from './pages/customer/DestinationDetailPage';
import ToursPage from './pages/customer/ToursPage';
import TourDetailPage from './pages/customer/TourDetailPage';
import ServicesListPage from './pages/customer/ServicesListPage';
import ServiceDetailPage from './pages/customer/ServiceDetailPage';
import EMagazinePage from './pages/customer/EMagazinePage';
import ArticleDetailPage from './pages/customer/ArticleDetailPage';
import SocialFeedPage from './pages/customer/SocialFeedPage';
import ArticlesPage from './pages/admin/ArticlesPage';
import ArticleEditorPage from './pages/admin/ArticleEditorPage';
import SocialAdminPage from './pages/admin/SocialAdminPage';
import FeedbackPage from './pages/admin/FeedbackPage';
import ProfilePage from './pages/customer/ProfilePage';
import ItineraryPage from './pages/customer/ItineraryPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import PaymentPage from './pages/customer/PaymentPage';

const Unauthorized = () => <div className="p-10 text-2xl text-red-500">403 - Không có quyền truy cập</div>;

// Component bảo vệ Route Admin/Editor
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/destinations" element={<DestinationsListPage />} />
      <Route path="/destination/:id" element={<DestinationDetailPage />} />
      <Route path="/tours" element={<ToursPage />} />
      <Route path="/tours/:id" element={<TourDetailPage />} />
      <Route path="/services" element={<ServicesListPage />} />
      <Route path="/service/:id" element={<ServiceDetailPage />} />
      <Route path="/emagazine" element={<EMagazinePage />} />
      <Route path="/emagazine/:slug" element={<ArticleDetailPage />} />
      <Route path="/social" element={<SocialFeedPage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRoles={['Traveler', 'Admin', 'Editor']}>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/itinerary" 
        element={
          <ProtectedRoute allowedRoles={['Traveler', 'Admin', 'Editor']}>
            <ItineraryPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute allowedRoles={['Traveler', 'Admin', 'Editor']}>
            <CheckoutPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/payment/:bookingId" 
        element={
          <ProtectedRoute allowedRoles={['Traveler', 'Admin', 'Editor']}>
            <PaymentPage />
          </ProtectedRoute>
        } 
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin/Editor Routes (Được bảo vệ) */}
      
      {/* Route Builder (Full screen, không có Sidebar) */}
      <Route 
        path="/admin/builder/destination/:destinationId" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Editor']}>
            <LandingPageBuilder />
          </ProtectedRoute>
        } 
      />

      {/* Route Dashboard chung (Có Sidebar) */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['Admin', 'Editor']}>
            <AdminLayout />
          </ProtectedRoute>
        } 
      >
        {/* Child routes của AdminLayout sẽ được render ở thẻ <Outlet /> */}
        <Route index element={<AdminDashboard />} />
        {/* Các trang khác sẽ add vào đây */}
        <Route path="destinations" element={<DestinationsPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="tours" element={<TourPackagesPage />} />
        <Route path="services" element={<LocalServicesPage />} />
        <Route path="bookings" element={<BookingPage />} />
        <Route path="articles" element={<ArticlesPage />} />
        <Route path="articles/:id/content" element={<ArticleEditorPage />} />
        <Route path="feedback" element={<FeedbackPage />} />
        <Route path="social" element={<SocialAdminPage />} />
        <Route 
          path="users" 
          element={
            <ProtectedRoute allowedRoles={['Admin']}>
              <UsersPage />
            </ProtectedRoute>
          } 
        />
        <Route path="settings" element={<div className="text-2xl text-primary font-bold">Cài đặt</div>} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
