import { Link } from "react-router-dom";
import api from "../api/axios";
import { useState, useEffect, useMemo, useContext } from "react";
import ProblemFilters from "../components/ProblemFilters";
import AuthContext from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

const Home = () => {
    const { user } = useContext(AuthContext);
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

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    const categories = useMemo(() => {
        const seen = new Map();
        problems.forEach((p) => {
            const name = (p.category || "").trim();
            if (name && !seen.has(name.toLowerCase())) {
                seen.set(name.toLowerCase(), name);
            }
        });
        return [...seen.values()].sort((a, b) => a.localeCompare(b));
    }, [problems]);

    const visible = problems.filter((p) => {
        const matchesCategory =
            !category || (p.category || "").trim().toLowerCase() === category.toLowerCase();
        const q = search.trim().toLowerCase();
        const matchesSearch =
            !q ||
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });
    if (loading) {
        return <LoadingScreen message="Finding community questions…" />;
    }

    if (error) {
        return <main className="feed-shell"><p className="text-danger">{error}</p></main>;
    }

    return (
        <main className="feed-shell">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="feed-heading mb-0">Popular problems</h1>
                <Link to="/post-problem" className="btn btn-primary rounded-pill d-md-none">+ Create</Link>
            </div>
            <div className="feed-layout">
              <section>
            <ProblemFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                categories={categories}
                shown={visible.length}
                total={problems.length}
                countClassName="text-secondary"
            />
            {problems.length > 0 && visible.length === 0 && (
                <p className="text-secondary">No problems match your search. Try a different word or clear the filters.</p>
            )}

            {problems.length === 0 ? (
                <div className="reddit-sidebar"><h2>No problems yet</h2><p>Start the conversation by sharing a problem with the community.</p><Link className="btn btn-primary rounded-pill" to="/post-problem">Create a post</Link></div>
            ) : visible.length === 0 ? (
                <p className="text-secondary">
                    No problems match your search. Try a different word or clear the filters.
                </p>
            ) : (
                <div>
                    {visible.map((problem) => (
                        <article className="reddit-post" key={problem._id}>
                            <div className="vote-rail" aria-label="Post score"><button className="vote-arrow" aria-label="Upvote">▲</button><span>•</span><button className="vote-arrow" aria-label="Downvote">▼</button></div>
                            <div className="reddit-post-body">
                                    <div className="reddit-meta">p/ {problem.category || "community"} · {problem.author?.username || "community member"}</div>
                                    <h2 className="reddit-title"><Link to={`/problems/${problem._id}`}>{problem.title}</Link></h2>
                                    <p className="reddit-description">
                                        {problem.description.length > 100
                                            ? problem.description.slice(0, 100) + "..."
                                            : problem.description}
                                    </p>
                                    <div className="reddit-actions"><Link to={`/problems/${problem._id}`} className="reddit-action">▤ View discussion</Link><span className="reddit-tag">{problem.category || "General"}</span></div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
              </section>
              <aside className="feed-sidebar reddit-sidebar">
                <h2>Home</h2>
                <p>Your community feed for questions, ideas, and answers. Browse recent problems or share one of your own.</p>
                <div className="d-grid gap-2">
                  <Link to="/problems" className="btn btn-outline-secondary rounded-pill">Browse problems</Link>
                  <Link to={user ? "/post-problem" : "/register"} className="btn btn-primary rounded-pill">{user ? "Create a post" : "Join the community"}</Link>
                </div>
              </aside>
            </div>
        </main>
    );
};

export default Home;
