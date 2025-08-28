import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider} from './contexts/AuthContext';
import Login from './pages/Login';
import InvoicePage from './component/InvoicePage';
import HomePage from './pages/Home/Home';

function ProtectedRoute({ children }) {
  if (!localStorage.getItem('user')) {
    return <Navigate to="/login" />;
  }

  return children;
}


function App() {
  useEffect(() => {
    const hanldeUnload = ()=>{
      localStorage.removeItem('user');
    }
    window.addEventListener('unload', hanldeUnload);
    return () => {
      window.removeEventListener('unload', hanldeUnload);
    }
  }, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} />
          <Route
            path="/bill"
            element={
              <ProtectedRoute>
                <InvoicePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
