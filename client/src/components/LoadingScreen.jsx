const LoadingScreen = ({ message = "Loading your page…", fullScreen = false, compact = false }) => (
    <div className={`loading-screen ${fullScreen ? "loading-screen-full" : ""} ${compact ? "loading-screen-compact" : ""}`} role="status" aria-live="polite" aria-label={message}>
        <div className="loading-mark" aria-hidden="true">S</div>
        <div className="loading-spinner" aria-hidden="true" />
        <p>{message}</p>
    </div>
);

export default LoadingScreen;
