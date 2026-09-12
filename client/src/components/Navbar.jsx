import { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">

                <Link className="navbar-brand" to="/">
                    Problem Solver
                </Link>

                <div className="d-flex align-items-center gap-2">

                    {user ? (
                        <>
                            <span className="me-3">
                                Hi, {user.username}
                            </span>

                            <button
                                className="btn btn-outline-danger"
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                className="btn btn-primary"
                                to="/login"
                            >
                                Login
                            </Link>

                            <Link
                                className="btn btn-success"
                                to="/register"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>
        </nav>
    );
};

export default Navbar;