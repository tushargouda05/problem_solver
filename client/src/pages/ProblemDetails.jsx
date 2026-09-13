import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const ProblemDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await api.get(`/problems/${id}`);
                setProblem(res.data);
            } catch (err) {
                setError("Problem not found");
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm("Delete this problem?")) {
            return;
        }

        try {
            await api.delete(`/problems/${id}`);
            navigate("/");
        } catch (err) {
            alert("Failed to delete");
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="container mt-4">

            <div className="card">
                <div className="card-body">

                    <span className="badge bg-secondary mb-2">
                        {problem.category}
                    </span>

                    <h1 className="card-title">
                        {problem.title}
                    </h1>
                    <p className="card-text">
                        {problem.description}
                    </p>

                    <p>
                        Posted By: {problem.author.username}
                    </p>

                    {user && problem.author._id === user.id && (
                        <div className="mt-3">

                            <button className="btn btn-warning me-2">
                                Edit
                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>

                        </div>
                    )}

                </div>
            </div>

        </div>
    );
};

export default ProblemDetails;

