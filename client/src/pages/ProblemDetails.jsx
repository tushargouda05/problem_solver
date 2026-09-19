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
    const [solutions, setSolutions] = useState([]);
    const [newSolution, setNewSolution] = useState("");
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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

    useEffect(() => {
        const fetchSolutions = async () => {
            try {
                const res = await api.get(`/solutions/${id}`);
                setSolutions(res.data);
            }
            catch (err) {
                console.error(err);
            }
        }; fetchSolutions();
    }, [id]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/comments/Problem/${id}`); setComments(res.data);
            } catch (err) { console.error(err); }
        };
        fetchComments();
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
    const handlePostSolution = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/solutions/${id}`, { content: newSolution });
            setSolutions([...solutions, res.data]); setNewSolution("");
        }
        catch (err) { alert("Failed to post solution"); }
    };
    const handleLike = async (solutionId) => {
        try {
            const res = await api.post(`/solutions/${solutionId}/like`);
            setSolutions(solutions.map((s) => (s._id === solutionId ? res.data : s)));
        }
        catch (err) { alert("Failed to like"); }
    };
    const handleDislike = async (solutionId) => {
        try {
            const res = await api.post(`/solutions/${solutionId}/dislike`);
            setSolutions(solutions.map((s) => (s._id === solutionId ? res.data : s)));
        }
        catch (err) { alert("Failed to like"); }
    };

    const handlePostComment = async (e) => {
        e.preventDefault(); try {
            const res = await api.post(`/comments/Problem/${id}`, { content: newComment }); setComments([...comments, res.data]); setNewComment("");
        } catch (err) {
            alert("Failed to post comment");
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
                    <span className="badge bg-secondary mb-2">{problem.category}</span>
                    <h1 className="card-title">{problem.title}</h1>
                    <p className="card-text">{problem.description}</p>
                    <p>Posted By: {problem.author.username}</p>

                    {user && problem.author._id === user.id && (
                        <div className="mt-3">
                            <button className="btn btn-warning me-2">Edit</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <h3>Solutions</h3>

                {user ? (
                    <form onSubmit={handlePostSolution}>
                        <textarea
                            className="form-control mb-2"
                            value={newSolution}
                            onChange={(e) => setNewSolution(e.target.value)}
                            placeholder="Write a solution..."
                        />
                        <button className="btn btn-primary mb-3">Post Solution</button>
                    </form>
                ) : (
                    <p className="text-muted">Log in to post a solution.</p>
                )}

                {solutions.length === 0 ? (
                    <p>No solutions yet.</p>
                ) : (
                    solutions.map((solution) => (
                        <div className="card mb-2" key={solution._id}>
                            <div className="card-body">
                                <p className="mb-1">{solution.content}</p>
                                <small className="text-muted">By {solution.author.username}</small>
                                <button className={`btn btn-sm me-2 ${solution.likes.includes(user?.id) ? "btn-success" : "btn-outline-success"}`} onClick={() => handleLike(solution._id)} disabled={!user}> like{solution.likes.length}</button>
                                <button className={`btn btn-sm me-2 ${solution.dislikes.includes(user?.id) ? "btn-danger" : "btn-outline-danger"}`} onClick={() => handleDislike(solution._id)} disabled={!user}> dislike{solution.dislikes.length}</button>

                            </div>
                        </div>
                    ))
                )}

                {/* Comments */}
                <div className="mt-4">
                    <h3>Comments</h3>

                    {user ? (
                        <form onSubmit={handlePostComment}>
                            <textarea
                                className="form-control mb-2"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                required
                            />

                            <button className="btn btn-primary mb-3">
                                Post Comment
                            </button>
                        </form>
                    ) : (
                        <p className="text-muted">Log in to comment.</p>
                    )}

                    {comments.map((comment) => (
                        <p key={comment._id}>
                            <strong>by {comment.author.username}:</strong>{" "}
                            {comment.content}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemDetails;

