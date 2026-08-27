import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { InvoiceModal } from './components/common/InvoiceModal';
import { WorkerProfileModal } from './components/workers/WorkerProfileModal';
import { EmergencyBookingModal } from './components/emergency/EmergencyBookingModal';
import { BookingFlow } from './components/booking/BookingFlow';
import { LandingPage } from './components/landing/LandingPage';
import { ServiceBrowser } from './components/services/ServiceBrowser';
import { AuthPage } from './components/auth/AuthPage';
import { CustomerDashboard } from './components/dashboard/CustomerDashboard';
import { WorkerDashboard } from './components/dashboard/WorkerDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { SahyogChatbot } from './components/common/SahyogChatbot';
import { ChangePasswordModal } from './components/common/ChangePasswordModal';
import { EditProfileModal } from './components/common/EditProfileModal';
import { LiveOrderTrackingModal } from './components/booking/LiveOrderTrackingModal';
import { CustomerCareSection } from './components/care/CustomerCareSection';
import { ServiceCategory, Worker } from './lib/database.types';

const MainAppContent: React.FC = () => {
  const { currentUser, currentRole } = useAuth();
  const { openBookingFlow, selectedBookingForTracking, closeTrackingModal } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'care' | 'dashboard' | 'auth'>('home');
  const [browserCategory, setBrowserCategory] = useState<ServiceCategory | null>(null);

  const handleSelectCategoryFromLanding = (cat: ServiceCategory) => {
    setBrowserCategory(cat);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreServices = () => {
    setBrowserCategory(null);
    setActiveTab('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectWorkerForBooking = (worker: Worker) => {
    openBookingFlow(undefined, worker);
  };

  const handleAuthSuccess = () => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A2E26]">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={(tab: any) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 mobile-nav-pb md:pb-0">
        {currentUser && currentUser.email === 'admin@gmail.com' ? (
          <AdminDashboard />
        ) : currentUser && currentRole === 'worker' ? (
          <WorkerDashboard />
        ) : (
          <>
            {activeTab === 'home' && (
              <LandingPage
                onSelectCategory={handleSelectCategoryFromLanding}
                onExploreServices={handleExploreServices}
                onNavigateCare={() => {
                  setActiveTab('care');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeTab === 'services' && (
              <ServiceBrowser
                initialCategory={browserCategory}
                onSelectWorkerForBooking={handleSelectWorkerForBooking}
                onNavigateHome={() => setActiveTab('home')}
              />
            )}

            {activeTab === 'care' && (
              <CustomerCareSection onNavigateHome={() => setActiveTab('home')} />
            )}

            {activeTab === 'auth' && (
              <AuthPage
                initialMode="signin"
                onNavigateHome={() => setActiveTab('home')}
                onLoginSuccess={handleAuthSuccess}
              />
            )}

            {activeTab === 'dashboard' && (
              <>
                {!currentUser ? (
                  <AuthPage
                    initialMode="signin"
                    onNavigateHome={() => setActiveTab('home')}
                    onLoginSuccess={handleAuthSuccess}
                  />
                ) : currentUser.email === 'admin@gmail.com' ? (
                  <AdminDashboard />
                ) : (
                  <CustomerDashboard />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Global Modals */}
      <AuthModal />
      <InvoiceModal />
      <WorkerProfileModal />
      <EmergencyBookingModal />
      <BookingFlow />
      <ChangePasswordModal />
      <EditProfileModal />
      <LiveOrderTrackingModal
        booking={selectedBookingForTracking}
        isOpen={Boolean(selectedBookingForTracking)}
        onClose={closeTrackingModal}
      />

      {/* Sahyog Sahayak AI Chatbot */}
      <SahyogChatbot onNavigateTab={(tab: any) => setActiveTab(tab)} />

      {/* Footer */}
      <Footer onNavigateTab={(tab: any) => setActiveTab(tab)} />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <MainAppContent />
        </MarketplaceProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
