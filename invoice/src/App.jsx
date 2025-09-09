import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home/Home';
import UpdateProfile from './pages/UpdateProfile';
import InvoicePage from './component/InvoicePage';
import InvoiceList from './pages/InvoiceList';
import InvoiceView from './pages/InvoiceView';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/update-profile" element={<UpdateProfile />} />
            <Route path="/bill" element={<InvoicePage />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoice/:id" element={<InvoiceView />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
