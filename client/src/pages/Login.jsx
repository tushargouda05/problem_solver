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
    <div
        className="container-fluid d-flex justify-content-center align-items-center py-5"
        style={{
            minHeight: "85vh",
            backgroundColor: "#9de2ff",
            borderRadius: "10px",
        }}
    >
        <div className="col-12 col-md-7 col-lg-5 col-xl-4">
            <div
                className="card shadow"
                style={{ borderRadius: "15px" }}
            >
                <div className="card-body p-4 p-md-5">

                    {/* Pills Navigation */}
                    <ul className="nav nav-pills nav-justified mb-4">
                        <li className="nav-item">
                            <span className="nav-link active">
                                Login
                            </span>
                        </li>
                        <li className="nav-item">
                            <span className="nav-link disabled">
                                Register
                            </span>
                        </li>
                    </ul>

                    <h3 className="text-center mb-2">Welcome Back!</h3>
                    <p className="text-center text-muted mb-4">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit}>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="loginEmail"
                                className="form-label"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                id="loginEmail"
                                className="form-control form-control-lg"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label
                                htmlFor="loginPassword"
                                className="form-label"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="loginPassword"
                                className="form-control form-control-lg"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 mb-4"
                        >
                            Login
                        </button>

                        <p className="text-center text-muted mb-0">
                            Welcome to Problem Solver!
                        </p>

                    </form>
                </div>
            </div>
        </div>
    </div>
);
};

export default Login;
