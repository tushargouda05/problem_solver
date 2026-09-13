import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const PostProblem = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/problems", {
                title,
                description,
                category
            });

            navigate(`/problems/${res.data._id}`);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to post problem"
            );
        }
    };

    return (
        <div className="container mt-5">

            <h1 className="mb-4">Post a Problem</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Problem title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <textarea
                    className="form-control mb-3"
                    rows="4"
                    placeholder="Describe your problem"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />

                <button type="submit" className="btn btn-primary"  >Post Problem</button>

            </form>

            {error && (
                <p className="text-danger mt-3">
                    {error}
                </p>
            )}

        </div>
    );
};

export default PostProblem;
