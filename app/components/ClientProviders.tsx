'use client';

import { AuthProvider, useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import { ToastProvider } from './Toast';
import AnalyticsProvider from './AnalyticsProvider';

function GlobalAuthModal() {
  const { showAuth, setShowAuth, authMessage } = useAuth();
  return (
    <AuthModal
      isOpen={showAuth}
      onClose={() => setShowAuth(false)}
      message={authMessage}
    />
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider>
      <AuthProvider>
        <ToastProvider>
          {children}
          <GlobalAuthModal />
        </ToastProvider>
      </AuthProvider>
    </AnalyticsProvider>
  );
}
