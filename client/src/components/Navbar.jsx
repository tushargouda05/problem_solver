import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import logo from "../assets/logoproblemsolver.png"; 
 
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);
 
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid px-3 px-lg-4">
                <Link className="navbar-brand" to="/" onClick={close}>
                    <img src={logo} alt="SolveNest" height="40" />
                </Link>
 
                <button
                    className="navbar-toggler"
                    type="button"
                    aria-controls="main-nav"
                    aria-expanded={open}
                    aria-label="Toggle navigation"
                    onClick={() => setOpen(!open)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
 
                <div
                    className={`collapse navbar-collapse ${open ? "show" : ""}`}
                    id="main-nav"
                >
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/problems" onClick={close}>
                                Browse problems
                            </Link>
                        </li>
                    </ul>
 
                    <div className="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 pb-2 pb-lg-0">
                        {user ? (
                            <>
                                <span className="navbar-text me-lg-2">Hi, {user.username}</span>
                                <Link className="btn btn-outline-primary" to="/post-problem" onClick={close}>
                                    Post problem
                                </Link>
                                <Link className="btn btn-outline-secondary" to="/profile" onClick={close}>
                                    Profile
                                </Link>
                                <Link className="btn btn-outline-info" to="/notifications" onClick={close}>
                                    Notifications
                                </Link>
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={() => {
                                        close();
                                        logout();
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link className="btn btn-primary" to="/login" onClick={close}>
                                    Login
                                </Link>
                                <Link className="btn btn-success" to="/register" onClick={close}>
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
 
export default Navbar;
 