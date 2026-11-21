import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const PostProblem = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [error, setError] = useState("");
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setPosting(true);
        try {
            const res = await api.post("/problems", {
                title: title.trim(),
                description: description.trim(),
                category: category.trim()
            });
            navigate(`/problems/${res.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || "We couldn’t post your problem. Please try again.");
        } finally {
            setPosting(false);
        }
    };

    if (!user) return null;

    return (
        <main className="problem-form-page">
            <Link to="/problems" className="problem-back-link">← Back to problems</Link>
            <section className="problem-form-card">
                <div className="problem-form-kicker">ASK THE COMMUNITY</div>
                <h1>What do you need help with?</h1>
                <p className="problem-form-intro">Share enough detail so people can understand the situation and offer useful advice.</p>
                <form onSubmit={handleSubmit}>
                    <div className="problem-field">
                        <label htmlFor="problem-title">Title <span>Required</span></label>
                        <input id="problem-title" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Summarize your problem in one sentence" maxLength={120} required />
                        <small>Be specific. A clear title helps the right people find your post.</small>
                    </div>
                    <div className="problem-field">
                        <label htmlFor="problem-description">Details <span>Required</span></label>
                        <textarea id="problem-description" className="form-control" rows="7" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What are you trying to do? What have you tried so far? What happened?" required />
                        <small>Include relevant context, what you expected, and what happened instead.</small>
                    </div>
                    <div className="problem-field">
                        <label htmlFor="problem-category">Topic <span>Required</span></label>
                        <input id="problem-category" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="For example: programming, school, home" maxLength={50} required />
                        <small>A short topic helps others understand what your post is about.</small>
                    </div>
                    {error && <div className="alert alert-danger" role="alert">{error}</div>}
                    <div className="problem-form-actions">
                        <Link to="/problems" className="btn btn-outline-secondary rounded-pill">Cancel</Link>
                        <button type="submit" className="btn btn-primary rounded-pill" disabled={posting}>{posting ? "Posting…" : "Post problem"}</button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default PostProblem;
