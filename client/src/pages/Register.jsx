import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Link } from "react-router-dom";
const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await api.post("/auth/register", { username, email, password });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
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
                                <span className="nav-link disabled">
                                    Login
                                </span>
                            </li>
                            <li className="nav-item">
                                <span className="nav-link active">
                                    Register
                                </span>
                            </li>
                        </ul>

                        <h3 className="text-center mb-2">
                            Create Account
                        </h3>

                        <p className="text-center text-muted mb-4">
                            Join the Problem Solver community
                        </p>

                        <form onSubmit={handleRegister}>

                            {/* Username */}
                            <div className="mb-4">
                                <label
                                    htmlFor="registerUsername"
                                    className="form-label"
                                >
                                    Username
                                </label>

                                <input
                                    type="text"
                                    id="registerUsername"
                                    className="form-control form-control-lg"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-4">
                                <label
                                    htmlFor="registerEmail"
                                    className="form-label"
                                >
                                    Email
                                </label>

                                <input
                                    type="email"
                                    id="registerEmail"
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
                                    htmlFor="registerPassword"
                                    className="form-label"
                                >
                                    Password
                                </label>

                                <input
                                    type="password"
                                    id="registerPassword"
                                    className="form-control form-control-lg"
                                    placeholder="Create a password"
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

                            {/* Register Button */}
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg w-100 mb-4"
                            >
                                Register
                            </button>

                            <p className="text-center text-muted mb-0">
                                Start sharing problems and solutions!
                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
