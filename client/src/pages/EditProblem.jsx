import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const EditProblem = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const fetchProblem = async () => {
        try {
            const res = await api.get(`/problems/${id}`);

            if (user && res.data.author._id !== user.id) {
                navigate(`/problems/${id}`);
                return;
            }

            setTitle(res.data.title);
            setDescription(res.data.description);
            setCategory(res.data.category);
        } catch (err) {
            setError("Failed to load problem");
        } finally {
            setLoading(false);
        }
    };
    fetchProblem();
}, [id, user, navigate]);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await api.get(`/problems/${id}`);
                setTitle(res.data.title); setDescription(res.data.description); setCategory(res.data.category);
            } catch (err) { setError("Failed to load problem"); }
            finally { setLoading(false); }
        }; fetchProblem();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/problems/${id}`, { title, description, category });
            navigate(`/problems/${id}`);
        }
        catch (err) {
            setError(err.response?.data?.message || "Failed to update");

        }
    };
    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div className="container mt-5">

            <h1 className="mb-4">Edit Problem</h1>

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

                <button type="submit" className="btn btn-primary" >Update Problem</button>

            </form>

            {error && (
                <p className="text-danger mt-3">
                    {error}
                </p>
            )}

        </div>
    );
};

export default EditProblem;
