import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { useKeyboardShortcuts, globalShortcuts } from './hooks/useKeyboardShortcuts';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReservationsPage from './pages/ReservationsPage';
import GuestsPage from './pages/GuestsPage';
import RoomsPage from './pages/RoomsPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './components/Reports/ReportsPage';
import FrontDeskPage from './components/FrontDesk/FrontDeskPage';
import HousekeepingPage from './components/Housekeeping/HousekeepingPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import KeyboardShortcutsModal from './components/Common/KeyboardShortcutsModal';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    ...globalShortcuts.map(shortcut => ({
      ...shortcut,
      action: () => {
        switch (shortcut.key) {
          case 'h':
            if (shortcut.ctrlKey) setCurrentPage('dashboard');
            break;
          case 'r':
            if (shortcut.ctrlKey) setCurrentPage('reservations');
            break;
          case 'g':
            if (shortcut.ctrlKey) setCurrentPage('guests');
            break;
          case 'm':
            if (shortcut.ctrlKey) setCurrentPage('rooms');
            break;
          case 's':
            if (shortcut.ctrlKey) setCurrentPage('settings');
            break;
          case '/':
            setShowShortcuts(true);
            break;
        }
      }
    }))
  ]);

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'reservations':
        return <ReservationsPage />;
      case 'guests':
        return <GuestsPage />;
      case 'rooms':
        return <RoomsPage />;
      case 'frontdesk':
        return <FrontDeskPage />;
      case 'housekeeping':
        return <HousekeepingPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header user={user} onLogout={logout} />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
      <KeyboardShortcutsModal 
        isOpen={showShortcuts} 
        onClose={() => setShowShortcuts(false)} 
      />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;