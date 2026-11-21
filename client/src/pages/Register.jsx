import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            await api.post("/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="auth-screen">
            <section className="auth-card">
                <div className="auth-mark" aria-hidden="true">S</div>
                <h1 className="auth-title">Join the community</h1>
                <p className="auth-subtitle">Create an account and share what you know.</p>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label htmlFor="registerUsername" className="form-label">Username</label>
                        <input type="text" id="registerUsername" className="form-control" placeholder="Choose a username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="registerEmail" className="form-label">Email</label>
                        <input type="email" id="registerEmail" className="form-control" placeholder="you@example.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="registerPassword" className="form-label">Password</label>
                        <input type="password" id="registerPassword" className="form-control" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    <button type="submit" className="btn btn-primary auth-submit w-100" disabled={submitting}>{submitting ? "Creating account…" : "Create account"}</button>
                </form>
                <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
            </section>
        </main>
    );
};

export default Register;
