import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 VAIDYA AI Health Assistant. For educational purposes only.</p>
          <p className="mt-1">Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};
