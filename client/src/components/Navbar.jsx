import { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import logo from "../assets/logoproblemsolver.png";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <nav className="navbar navbar-expand-lg reddit-navbar sticky-top">
            <div className="container-fluid px-3 px-lg-4">
                <Link className="navbar-brand d-flex align-items-center gap-2" to="/" onClick={close} aria-label="SolveNest home">
                    <img src={logo} alt="" height="34" />
                    <span className="brand-wordmark">SolveNest</span>
                </Link>

                <button className="navbar-toggler" type="button" aria-controls="main-nav" aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)}>
                    <span className="navbar-toggler-icon" />
                </button>

                <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="main-nav">
                    <div className="navbar-nav me-auto nav-main-links">
                        <NavLink className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} to="/problems" onClick={close}>Explore</NavLink>
                    </div>
                    <div className="navbar-actions">
                        {user ? (
                            <>
                                <Link className="btn btn-primary rounded-pill nav-create" to="/post-problem" onClick={close}><span aria-hidden="true">＋</span> Ask a question</Link>
                                <Link className="nav-icon-link" to="/notifications" onClick={close}>Notifications</Link>
                                <Link className="nav-profile-link" to="/profile" onClick={close}><span className="user-avatar">{user.username?.[0]?.toUpperCase() || "U"}</span><span>{user.username}</span></Link>
                                <button className="nav-logout" onClick={() => { close(); logout(); }}>Log out</button>
                            </>
                        ) : (
                            <>
                                <Link className="nav-login-link" to="/login" onClick={close}>Log in</Link>
                                <Link className="btn btn-primary rounded-pill nav-signup" to="/register" onClick={close}>Sign up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
