import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const features = [
    ["Read problems, solutions and comments", true],
    ["Search problems and filter by category", true],
    ["Post problems", false],
    ["Post solutions and comments", false],
    ["Like or dislike solutions", false],
    ["Get notified when someone answers your problem", false],
];

const steps = [
    {
        title: "Post a problem",
        body: "Describe what you are stuck on and give it a category. Categories are free text, so any topic fits.",
    },
    {
        title: "Get solutions",
        body: "Anyone with an account can answer and comment. You get a notification when a new solution arrives.",
    },
    {
        title: "React to answers",
        body: "Like the solutions that helped and dislike the ones that didn't. You can change your reaction at any time.",
    },
];

const Landing = () => {
    const { user } = useContext(AuthContext);
    const [recent, setRecent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadRecent = async () => {
            try {
                const res = await api.get("/problems");
                setRecent(res.data.slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadRecent();
    }, []);

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Hero */}
            <section className="container py-5">
                <div className="row align-items-center g-5 py-lg-4">
                    <div className="col-lg-6">
                        <span className="badge text-bg-light border text-secondary fw-normal mb-3">
                            Community-powered answers
                        </span>
                        <h1 className="display-6 fw-bold mb-3" style={{ maxWidth: "30rem" }}>
                            Stuck on something? Ask people who have solved it.
                        </h1>
                        <p className="lead text-secondary mb-4" style={{ maxWidth: "34rem" }}>
                            Post a problem from any field, collect solutions from the
                            community, and like the answers that helped.
                        </p>
                        <div className="d-flex flex-wrap gap-2">
                            {user ? (
                                <>
                                    <Link className="btn btn-primary btn-lg" to="/post-problem">
                                        Post a problem
                                    </Link>
                                    <Link className="btn btn-outline-secondary btn-lg" to="/problems">
                                        Browse problems
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link className="btn btn-primary btn-lg" to="/register">
                                        Create a free account
                                    </Link>
                                    <Link className="btn btn-outline-secondary btn-lg" to="/problems">
                                        Browse without signing up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="d-flex justify-content-between align-items-baseline mb-3">
                            <h2 className="h5 mb-0">Latest problems</h2>
                            {recent.length > 0 && (
                                <Link to="/problems" className="small">
                                    See all problems
                                </Link>
                            )}
                        </div>

                        {loading && (
                            <p className="text-secondary mb-0">
                                Loading the latest problems. The server may need up to a
                                minute to wake up.
                            </p>
                        )}

                        {!loading && recent.length === 0 && (
                            <p className="text-secondary mb-0">
                                No problems yet. Be the first to post one.
                            </p>
                        )}

                        {recent.length > 0 && (
                            <div className="list-group shadow-sm">
                                {recent.map((problem) => (
                                    <Link
                                        key={problem._id}
                                        to={`/problems/${problem._id}`}
                                        className="list-group-item list-group-item-action py-3"
                                    >
                                        <div className="d-flex justify-content-between align-items-start gap-3">
                                            <span className="fw-semibold">{problem.title}</span>
                                            <span className="badge rounded-pill text-bg-secondary align-self-start flex-shrink-0">
                                                {problem.category}
                                            </span>
                                        </div>
                                        <small className="text-secondary">
                                            {problem.author?.username
                                                ? `Posted by ${problem.author.username}`
                                                : "Posted by an anonymous user"}
                                        </small>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* What you can do */}
            <section className="border-top py-5 bg-body-tertiary">
                <div className="container">
                    <h2 className="h3 mb-2">What you can do</h2>
                    <p className="text-secondary mb-4">
                        You can look around without an account. Creating one is free.
                    </p>
                    <div className="table-responsive card shadow-sm">
                        <table className="table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">Feature</th>
                                    <th scope="col" className="text-center">Guest</th>
                                    <th scope="col" className="text-center">Member</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map(([label, guestCan]) => (
                                    <tr key={label}>
                                        <td>{label}</td>
                                        <td className="text-center">
                                            {guestCan ? (
                                                <span className="badge rounded-pill bg-success-subtle text-success-emphasis">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="text-secondary">&mdash;</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <span className="badge rounded-pill bg-success-subtle text-success-emphasis">
                                                Yes
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="container py-5">
                <h2 className="h3 mb-4">How it works</h2>
                <div className="row g-4">
                    {steps.map((step, i) => (
                        <div className="col-md-4" key={step.title}>
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="text-secondary small fw-semibold mb-2">
                                        Step {i + 1}
                                    </div>
                                    <h3 className="h5">{step.title}</h3>
                                    <p className="text-secondary mb-0">{step.body}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="border-top py-4 mt-auto">
                <div className="container d-flex flex-wrap justify-content-between gap-2 text-secondary small">
                    <span>Problem Solver, built with MongoDB, Express, React and Node.</span>
                    <a
                        className="text-secondary text-decoration-none"
                        href="https://github.com/tushargouda05/problem_solver"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Source code on GitHub
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Landing;