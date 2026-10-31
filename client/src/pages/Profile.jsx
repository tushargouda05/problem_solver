import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login"); return;
        }
        const fetchMyProblems = async () => {
            try {
                const res = await api.get(`/problems?author=${user.id}`); setProblems(res.data);
            } catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMyProblems();
    }, [user, navigate]);


    if (loading) {
        return <p>Loading...</p>;
    }

return (
    <section
        className="w-100 px-4 py-5"
        style={{
            backgroundColor: "#092c3b",
            borderRadius: ".5rem .5rem 0 0",
        }}
    >
        <div className="row d-flex justify-content-center">
            <div className="col col-md-9 col-lg-7 col-xl-6">
                
                {/* Profile Card */}
                <div className="card" style={{ borderRadius: "15px" }}>
                    <div className="card-body p-4">
                        <div className="d-flex">
                            <div className="flex-grow-1">
                                <h5 className="mb-1">{user.username}</h5>
                                <p className="mb-3 pb-1 text-muted">
                                    {user.email}
                                </p>

                                {/* Profile Statistics */}
                                <div className="d-flex justify-content-start rounded-3 p-3 mb-3 bg-body-tertiary">
                                    <div>
                                        <p className="small text-muted mb-1">
                                            Posts
                                        </p>
                                        <p className="mb-0 fw-bold">
                                            {problems.length}
                                        </p>
                                    </div>
                                </div>

                                <div className="d-flex pt-1">
                                    <Link
                                        to="/"
                                        className="btn btn-outline-primary me-2 flex-grow-1"
                                    >
                                        Home
                                    </Link>

                                    <Link
                                        to="/problems"
                                        className="btn btn-primary flex-grow-1"
                                    >
                                        Explore Posts
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Posts */}
                <div className="mt-4">
                    <h4 className="mb-3">Your Posts</h4>

                    {problems.length === 0 ? (
                        <div className="card" style={{ borderRadius: "15px" }}>
                            <div className="card-body text-center py-4">
                                <h5>No Posts</h5>
                                <p className="text-muted mb-0">
                                    There are no posts to show.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="row">
                            {problems.map((problem) => (
                                <div
                                    className="col-md-6 mb-3"
                                    key={problem._id}
                                >
                                    <div
                                        className="card h-100"
                                        style={{ borderRadius: "15px" }}
                                    >
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                {problem.title}
                                            </h5>

                                            <span className="badge bg-primary mb-2">
                                                {problem.category}
                                            </span>

                                            <p className="card-text">
                                                {problem.description.length > 100
                                                    ? problem.description.substring(0, 100) + "..."
                                                    : problem.description}
                                            </p>

                                            <Link
                                                to={`/problems/${problem._id}`}
                                                className="btn btn-primary"
                                            >
                                                View Problem
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </section>
);
};

export default Profile;
