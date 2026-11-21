import { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const res = await api.get(`/problems/${id}`);
                if (user && res.data.author?._id !== user.id) {
                    navigate(`/problems/${id}`);
                    return;
                }
                setTitle(res.data.title || "");
                setDescription(res.data.description || "");
                setCategory(res.data.category || "");
            } catch (err) {
                setError("We couldn’t load this problem. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try {
            await api.put(`/problems/${id}`, { title: title.trim(), description: description.trim(), category: category.trim() });
            navigate(`/problems/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || "We couldn’t save your changes. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <main className="problem-form-page"><p>Loading your problem…</p></main>;

    return (
        <main className="problem-form-page">
            <Link to={`/problems/${id}`} className="problem-back-link">← Back to problem</Link>
            <section className="problem-form-card">
                <div className="problem-form-kicker">EDIT YOUR POST</div>
                <h1>Update your problem</h1>
                <p className="problem-form-intro">Make your changes below. Your existing discussion will stay with the post.</p>
                <form onSubmit={handleSubmit}>
                    <div className="problem-field">
                        <label htmlFor="problem-title">Title <span>Required</span></label>
                        <input id="problem-title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
                    </div>
                    <div className="problem-field">
                        <label htmlFor="problem-description">Details <span>Required</span></label>
                        <textarea id="problem-description" className="form-control" rows="7" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="problem-field">
                        <label htmlFor="problem-category">Topic <span>Required</span></label>
                        <input id="problem-category" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} maxLength={50} required />
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="problem-form-actions">
                        <Link to={`/problems/${id}`} className="btn btn-outline-secondary rounded-pill">Cancel</Link>
                        <button type="submit" className="btn btn-primary rounded-pill" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default EditProblem;
