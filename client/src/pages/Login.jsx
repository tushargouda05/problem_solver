import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            navigate("/problems");
        } catch (err) {
            setError("Invalid email or password");
        }
    };

return (
    <main className="auth-screen">
        <section className="auth-card">
            <div className="auth-mark" aria-hidden="true">S</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Log in to join the conversation.</p>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="loginEmail" className="form-label">Email</label>
                    <input type="email" id="loginEmail" className="form-control" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                    <label htmlFor="loginPassword" className="form-label">Password</label>
                    <input type="password" id="loginPassword" className="form-control" placeholder="Your password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                <button type="submit" className="btn btn-primary auth-submit w-100">Log in</button>
            </form>
            <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        </section>
    </main>
);
};

export default Login;
