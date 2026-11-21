import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

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
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [voting, setVoting] = useState({});

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
            navigate("/problems");
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
    const handleVote = async (solutionId, vote) => {
        if (!user || voting[solutionId]) return;
        setVoting((current) => ({ ...current, [solutionId]: true }));
        try {
            const res = await api.post(`/solutions/${solutionId}/${vote}`);
            setSolutions((current) => current.map((s) => (s._id === solutionId ? res.data : s)));
        }
        catch (err) { alert(`Failed to ${vote} solution`); }
        finally { setVoting((current) => ({ ...current, [solutionId]: false })); }
    };

    const handlePostComment = async (e, parentComment = null) => {
        e.preventDefault();
        const content = parentComment ? replyContent : newComment;
        try {
            const res = await api.post(`/comments/Problem/${id}`, { content, parentComment });
            setComments((current) => [...current, res.data]);
            if (parentComment) {
                setReplyContent("");
                setReplyingTo(null);
            } else {
                setNewComment("");
            }
        } catch (err) {
            alert("Failed to post comment");
        }
    };

    const commentMap = new Map(comments.map((comment) => [comment._id, { ...comment, children: [] }]));
    const rootComments = [];
    commentMap.forEach((comment) => {
        const parentId = typeof comment.parentComment === "object"
            ? comment.parentComment?._id
            : comment.parentComment;
        const parent = parentId && commentMap.get(parentId);
        if (parent) parent.children.push(comment);
        else rootComments.push(comment);
    });

    const renderComment = (comment, depth = 0) => (
        <article className="thread-comment" key={comment._id} style={{ "--thread-depth": Math.min(depth, 5) }}>
            <div className="thread-avatar" aria-hidden="true">{comment.author?.username?.[0]?.toUpperCase() || "U"}</div>
            <div className="thread-content">
                <div className="thread-meta"><strong>{comment.author?.username || "Former community member"}</strong><time dateTime={comment.createdAt}>{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}</time></div>
                <p>{comment.content}</p>
                {user && <button type="button" className="thread-reply-button" onClick={() => { setReplyingTo(replyingTo === comment._id ? null : comment._id); setReplyContent(""); }}>Reply</button>}
                {replyingTo === comment._id && (
                    <form className="thread-reply-form" onSubmit={(e) => handlePostComment(e, comment._id)}>
                        <textarea className="form-control" rows="2" value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder={`Reply to ${comment.author?.username || "this comment"}…`} required />
                        <div className="d-flex justify-content-end gap-2 mt-2">
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setReplyingTo(null)}>Cancel</button>
                            <button type="submit" className="btn btn-sm btn-primary rounded-pill">Reply</button>
                        </div>
                    </form>
                )}
                {comment.children.length > 0 && <div className="thread-replies">{comment.children.map((child) => renderComment(child, depth + 1))}</div>}
            </div>
        </article>
    );
    if (loading) return <main className="problem-view"><p>Loading problem…</p></main>;

    if (error) {
        return <main className="problem-view"><div className="alert alert-danger">{error}</div><Link to="/problems">Back to problems</Link></main>;
    }

    return (
        <main className="problem-view">
            <Link to="/problems" className="problem-back-link">← All problems</Link>
            <article className="problem-detail-card">
                <div className="problem-detail-topline"><span className="reddit-tag">{problem.category || "General"}</span><span>Posted by <strong>{problem.author?.username || "Former community member"}</strong></span></div>
                <h1>{problem.title}</h1>
                <p className="problem-detail-description">{problem.description}</p>
                {user && problem.author?._id === user.id && (
                    <div className="problem-owner-actions">
                        <Link to={`/problems/${id}/edit`} className="btn btn-sm btn-outline-secondary rounded-pill">Edit post</Link>
                        <button className="btn btn-sm btn-outline-danger rounded-pill" onClick={handleDelete}>Delete post</button>
                    </div>
                )}
            </article>

            <section className="discussion-section">
                <div className="discussion-heading"><div><span className="problem-form-kicker">COMMUNITY ANSWERS</span><h2>Solutions <span>{solutions.length}</span></h2></div></div>
                {user ? (
                    <form className="discussion-composer" onSubmit={handlePostSolution}>
                        <label htmlFor="solution-content">Share a helpful solution</label>
                        <textarea id="solution-content" className="form-control" rows="4" value={newSolution} onChange={(e) => setNewSolution(e.target.value)} placeholder="Explain what worked, or offer a useful next step…" required />
                        <div className="text-end mt-2"><button className="btn btn-primary rounded-pill" disabled={!newSolution.trim()}>Post solution</button></div>
                    </form>
                ) : <p className="discussion-signin"><Link to="/login">Log in</Link> to share a solution.</p>}

                {solutions.length === 0 ? <div className="discussion-empty"><strong>No solutions yet</strong><span>Be the first to help with this problem.</span></div> : (
                    <div className="solution-list">
                        {solutions.map((solution) => (
                            <article className="solution-card" key={solution._id}>
                                <div className="solution-author"><div className="thread-avatar">{solution.author?.username?.[0]?.toUpperCase() || "U"}</div><div><strong>{solution.author?.username || "Former community member"}</strong><span>Community solution</span></div></div>
                                <p className="solution-content">{solution.content}</p>
                                <div className="solution-feedback">
                                    <span>Was this helpful?</span>
                                    <div className="vote-controls" aria-label="Rate this solution">
                                        <button type="button" className={`vote-button ${solution.likes?.includes(user?.id) ? "is-liked" : ""}`} onClick={() => handleVote(solution._id, "like")} disabled={!user || voting[solution._id]} aria-pressed={Boolean(user && solution.likes?.includes(user.id))} aria-label={`Like solution, ${solution.likes?.length || 0} likes`} title={user ? "Mark as helpful" : "Log in to vote"}><span aria-hidden="true">♥</span><span>{solution.likes?.length || 0}</span></button>
                                        <button type="button" className={`vote-button vote-dislike ${solution.dislikes?.includes(user?.id) ? "is-disliked" : ""}`} onClick={() => handleVote(solution._id, "dislike")} disabled={!user || voting[solution._id]} aria-pressed={Boolean(user && solution.dislikes?.includes(user.id))} aria-label={`Dislike solution, ${solution.dislikes?.length || 0} dislikes`} title={user ? "Mark as not helpful" : "Log in to vote"}><span aria-hidden="true">♥</span><span>{solution.dislikes?.length || 0}</span></button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <section className="discussion-section comments-section">
                <div className="discussion-heading"><div><span className="problem-form-kicker">KEEP IT GOING</span><h2>Comments <span>{comments.length}</span></h2></div></div>
                {user ? (
                    <form className="thread-composer discussion-composer" onSubmit={(e) => handlePostComment(e)}>
                        <label htmlFor="comment-content">Add a comment</label>
                        <textarea id="comment-content" className="form-control" rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Ask a follow-up or add context…" required />
                        <div className="text-end mt-2"><button className="btn btn-primary rounded-pill" disabled={!newComment.trim()}>Post comment</button></div>
                    </form>
                ) : <p className="discussion-signin"><Link to="/login">Log in</Link> to join the discussion.</p>}
                {rootComments.length === 0 ? <div className="discussion-empty"><strong>No comments yet</strong><span>Start a friendly conversation about this problem.</span></div> : <div className="comment-thread-list">{rootComments.map((comment) => renderComment(comment))}</div>}
            </section>
        </main>
    );
};

export default ProblemDetails;

