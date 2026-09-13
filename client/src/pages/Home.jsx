import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await api.get("/problems");
                setProblems(res.data);
            } catch (err) {
                setError("Failed to load problems");
            } finally {
                setLoading(false);
            }
        };
        fetchProblems();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="container mt-4">
            <h1>Recent Problems</h1>
            {problems.length === 0 ? (
                <p>No problems posted yet.</p>
            ) : (
                <div className="row">
                    {problems.map((problem) => (
                        <div className="col-md-4 mb-3" key={problem._id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <span className="badge bg-secondary mb-2">{problem.category}</span>
                                    <h5 className="card-title">{problem.title}</h5>
                                    <p className="card-text">{problem.description.slice(0, 100)}...</p>
                                    <Link to={`/problems/${problem._id}`} className="btn btn-primary btn-sm">View</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;