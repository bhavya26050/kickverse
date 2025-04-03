// This file is transitioning to the App Router and should be removed once migration is complete
// Remove the invalid import and point to the app directory's global CSS
import Navbar from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';
import { AuthProvider } from '../context/AuthContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
