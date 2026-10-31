import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import ProblemDetails from './pages/ProblemDetails';
import PostProblem from './pages/PostProblem';
import EditProblem from './pages/EditProblem';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Landing from './pages/Landing';

function App() {
  return (
    <div>
      <Navbar />

      <Routes>

        <Route path="/" element={<Landing />} />
        <Route path="/problems" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/problems/:id" element={<ProblemDetails />} />
        <Route path="/post-problem" element={<PostProblem />} />
        <Route path="/problems/:id/edit" element={<EditProblem />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>
    </div>
  );
}

export default App;