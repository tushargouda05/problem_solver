
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useState, useEffect, useMemo } from "react";
import ProblemFilters from "../components/ProblemFilters";

const Home = () => {
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
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="container mt-4">
            <ProblemFilters
                search={search}
                onSearchChange={setSearch}
                category={category}
                onCategoryChange={setCategory}
                categories={categories}
                shown={visible.length}
                total={problems.length}
                countClassName="text-white-50"
            />
            {problems.length > 0 && visible.length === 0 && (
                <p className="text-white-50">No problems match your search. Try a different word or clear the filters.</p>
            )}
            <h1 className="text-white">Recent Problems</h1>

            {problems.length === 0 ? (
                <p className="text-white-50">No problems posted yet.</p>
            ) : visible.length === 0 ? (
                <p className="text-white-50">
                    No problems match your search. Try a different word or clear the filters.
                </p>
            ) : (
                <div className="row">
                    {visible.map((problem) => (
                        <div className="col-md-4 mb-3" key={problem._id}>
                            <div className="card h-100">
                                <div className="card-body">
                                    <span className="badge bg-secondary mb-2">{problem.category}</span>
                                    <h5 className="card-title">{problem.title}</h5>
                                    <p className="card-text">
                                        {problem.description.length > 100
                                            ? problem.description.slice(0, 100) + "..."
                                            : problem.description}
                                    </p>
                                    <Link to={`/problems/${problem._id}`}
                                        className="btn btn-primary btn-sm">View</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;