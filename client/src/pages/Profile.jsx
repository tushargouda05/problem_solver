import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const emptyStats = { posts: 0, solutions: 0, comments: 0, likes: 0, dislikes: 0 };

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [stats, setStats] = useState(emptyStats);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        const fetchProfile = async () => {
            try {
                const [problemsResponse, statsResponse] = await Promise.all([
                    api.get(`/problems?author=${user.id}`),
                    api.get("/profile/stats")
                ]);
                setProblems(problemsResponse.data);
                setStats({ ...emptyStats, ...statsResponse.data });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [user, navigate]);

    if (loading) return <main className="profile-page"><p>Loading profile…</p></main>;
    if (!user) return null;

    const metrics = [
        ["Posts", stats.posts, "▤"],
        ["Solutions", stats.solutions, "✦"],
        ["Comments", stats.comments, "◌"],
        ["Likes gained", stats.likes, "♥"],
        ["Dislikes", stats.dislikes, "♡"]
    ];

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-avatar">{user.username?.[0]?.toUpperCase() || "U"}</div>
                <div className="profile-identity">
                    <span className="profile-eyebrow">COMMUNITY PROFILE</span>
                    <h1>{user.username}</h1>
                    <p>{user.email}</p>
                </div>
                <Link to="/post-problem" className="btn btn-primary rounded-pill profile-create">+ Create post</Link>
            </section>

            <section className="profile-stats" aria-label="Your activity statistics">
                {metrics.map(([label, value, icon]) => (
                    <div className="profile-stat" key={label}>
                        <span className="profile-stat-icon" aria-hidden="true">{icon}</span>
                        <strong>{value.toLocaleString()}</strong>
                        <span>{label}</span>
                    </div>
                ))}
            </section>

            <section className="profile-posts-section">
                <div className="profile-section-heading">
                    <div><span className="profile-eyebrow">YOUR CONTRIBUTIONS</span><h2>Your posts</h2></div>
                    <Link to="/problems">Explore community →</Link>
                </div>
                {problems.length === 0 ? (
                    <div className="profile-empty">
                        <div className="profile-empty-icon">✦</div>
                        <h3>Your story starts here</h3>
                        <p>Share a problem and invite the community to help.</p>
                        <Link to="/post-problem" className="btn btn-primary rounded-pill">Create your first post</Link>
                    </div>
                ) : (
                    <div className="row g-3">
                        {problems.map((problem) => (
                            <div className="col-md-6" key={problem._id}>
                                <article className="profile-post-card h-100">
                                    <span className="reddit-tag">{problem.category || "General"}</span>
                                    <h3><Link to={`/problems/${problem._id}`}>{problem.title}</Link></h3>
                                    <p>{problem.description.length > 120 ? `${problem.description.slice(0, 120)}…` : problem.description}</p>
                                    <Link to={`/problems/${problem._id}`} className="reddit-action">▤ View discussion</Link>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Profile;
