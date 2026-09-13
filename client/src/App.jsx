import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ProblemDetails from './pages/ProblemDetails';

function App() {
  return (
    <div>
      <Navbar />
    
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/problems/:id" element={<ProblemDetails />} />
    </Routes>
    </div>
  );
}

export default App;