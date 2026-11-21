import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const steps = [
    { number: "01", title: "Ask clearly", body: "Describe what you’re working on and add the details people need to help." },
    { number: "02", title: "Learn together", body: "Get practical ideas and follow-up questions from the community." },
    { number: "03", title: "Share what worked", body: "Post a solution, join a discussion, and help the next person." }
];

const Landing = () => {
    const { user } = useContext(AuthContext);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const res = await api.get("/problems");
                setRecent(res.data.slice(0, 3));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadRecent();
    }, []);

    return (
        <main className="landing-page">
            <section className="landing-hero">
                <div className="landing-hero-copy">
                    <span className="landing-eyebrow"><span /> A community for curious minds</span>
                    <h1>Good questions lead to <span>better answers.</span></h1>
                    <p>Get unstuck with help from people who have been there. Ask a question, share what you know, and learn together.</p>
                    <div className="landing-actions">
                        <Link to={user ? "/post-problem" : "/register"} className="btn btn-primary rounded-pill">{user ? "Ask the community" : "Join the community"}<span aria-hidden="true"> →</span></Link>
                        <Link to="/problems" className="landing-secondary-link">Explore questions <span aria-hidden="true">↗</span></Link>
                    </div>
                    <div className="landing-trust-line"><span aria-hidden="true">✦</span> Read and explore without an account</div>
                </div>
                <div className="landing-hero-art" aria-hidden="true">
                    <div className="landing-orbit orbit-one" /><div className="landing-orbit orbit-two" />
                    <div className="landing-bubble bubble-question"><span>Q</span><i /><i /><i /></div>
                    <div className="landing-bubble bubble-answer"><span>✦</span><i /><i /></div>
                    <div className="landing-center-mark">S</div>
                    <div className="landing-spark spark-one">✦</div><div className="landing-spark spark-two">✧</div>
                </div>
            </section>

            <section className="landing-latest">
                <div className="landing-section-heading">
                    <div><span className="landing-eyebrow">FROM THE COMMUNITY</span><h2>Questions people are asking</h2></div>
                    <Link to="/problems">See all questions <span aria-hidden="true">→</span></Link>
                </div>
                {loading ? <div className="landing-empty">Finding the latest questions…</div> : recent.length === 0 ? (
                    <div className="landing-empty"><div className="landing-empty-mark">✦</div><strong>Be the first to ask</strong><span>Every useful conversation starts with a question.</span>{user && <Link to="/post-problem" className="btn btn-primary rounded-pill">Ask a question</Link>}</div>
                ) : (
                    <div className="landing-question-list">
                        {recent.map((problem) => (
                            <Link key={problem._id} to={`/problems/${problem._id}`} className="landing-question-card">
                                <span className="landing-question-icon" aria-hidden="true">?</span>
                                <span className="landing-question-main"><span className="reddit-tag">{problem.category || "General"}</span><strong>{problem.title}</strong><small>Asked by {problem.author?.username || "a community member"}</small></span>
                                <span className="landing-question-arrow" aria-hidden="true">↗</span>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="landing-how">
                <div className="landing-section-heading"><div><span className="landing-eyebrow">SIMPLE BY DESIGN</span><h2>How it works</h2></div></div>
                <div className="landing-step-grid">
                    {steps.map((step) => <article className="landing-step" key={step.number}><span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p></article>)}
                </div>
            </section>

            <footer className="landing-footer"><span>SolveNest · A place to ask, answer, and learn.</span><Link to="/problems">Explore the community</Link></footer>
        </main>
    );
};

export default Landing;
