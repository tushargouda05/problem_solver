import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ProblemDetails from './pages/ProblemDetails';
import PostProblem from './pages/PostProblem';
import EditProblem from './pages/EditProblem';
import Profile from './pages/Profile';

function App() {
  return (
    <div>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/post-problem" element={<PostProblem />} />
        <Route path="/problems/:id/edit" element={<EditProblem />}/>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;