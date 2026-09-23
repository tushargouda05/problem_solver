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
        <div className="container mt-5">

            <h1 className="mb-4">Profile</h1>

            <div className="mb-4">
                <h4>{user.username}</h4>
                <p>{user.email}</p>
            </div>

            <h3>Your Problems ({problems.length})</h3>

            {problems.length === 0 ? (
                <p className="mt-3">
                    You haven't posted any problems yet.
                </p>
            ) : (
                <div className="row">
                    {problems.map((problem) => (
                        <div className="col-md-6 mb-3" key={problem._id}>
                            <div className="card h-100">
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
    );
};
export default Profile;