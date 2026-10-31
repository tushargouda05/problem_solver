const ProblemFilters = ({
    search,
    onSearchChange,
    category,
    onCategoryChange,
    categories,
    shown,
    total,
    countClassName = "text-secondary",
}) => {
    const hasFilters = search !== "" || category !== "";

    const clear = () => {
        onSearchChange("");
        onCategoryChange("");
    };

    return (
        <div className="row g-2 align-items-center mb-3">
            <div className="col-12 col-md-6">
                <label htmlFor="problem-search" className="visually-hidden">
                    Search problems
                </label>
                <input
                    id="problem-search"
                    type="search"
                    className="form-control"
                    placeholder="Search by title or description"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="col-8 col-md-4">
                <label htmlFor="problem-category" className="visually-hidden">
                    Filter by category
                </label>
                <select
                    id="problem-category"
                    className="form-select"
                    value={category}
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    <option value="">All categories</option>
                    {categories.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-4 col-md-2 d-grid">
                <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clear}
                    disabled={!hasFilters}
                >
                    Clear
                </button>
            </div>

            <div className="col-12">
                <small className={countClassName}>
                    Showing {shown} of {total} problems
                </small>
            </div>
        </div>
    );
};

export default ProblemFilters;