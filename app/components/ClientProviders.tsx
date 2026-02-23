'use client';

import { AuthProvider, useAuth } from './AuthProvider';
import AuthModal from './AuthModal';
import { ToastProvider } from './Toast';

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
    <AuthProvider>
      <ToastProvider>
        {children}
        <GlobalAuthModal />
      </ToastProvider>
    </AuthProvider>
  );
}
