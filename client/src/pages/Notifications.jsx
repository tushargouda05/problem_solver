import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatActivityTime = (value) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "Date unavailable";
        const seconds = Math.round((date.getTime() - Date.now()) / 1000);
        const units = [
            [31536000, "year"], [2592000, "month"], [86400, "day"],
            [3600, "hour"], [60, "minute"], [1, "second"]
        ];
        const [size, unit] = units.find(([size]) => Math.abs(seconds) >= size) || [1, "second"];
        const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" }).format(Math.round(seconds / size), unit);
        return { relative, full: date.toLocaleString() };
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        const fetchNotifications = async () => {
            try {
                const res = await api.get("/notifications"); setNotifications(res.data);
            }
            catch (err) {
                console.error(err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user, navigate]);

    const handleMarkAsRead = async (notifId) => {
        try {
            const res = await api.put(`/notifications/${notifId}/read`);
            setNotifications((current) => current.map((n) => (n._id === notifId ? { ...n, isRead: res.data.isRead } : n)));
        } catch (err) {
            console.error(err);
        }
    };
    if (loading) {
        return <LoadingScreen message="Loading your notifications…" />;
    }

    return (
        <div className="container mt-5" style={{ maxWidth: 760 }}>

            <h1 className="mb-4">Notifications</h1>

            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification._id}
                        className={`card mb-3 notification-card ${notification.isRead ? "" : "notification-unread"}`}
                    >
                        <div className="card-body d-flex justify-content-between align-items-start gap-3">
                            <div>
                                <p className="mb-2">
                                    <strong>{notification.actor?.username || "Someone"}</strong>{" "}
                                    {notification.actor?.username
                                        ? notification.message.replace(/^Someone\s*/i, "")
                                        : notification.message}
                                </p>
                                {notification.relatedProblem?._id && (
                                    <Link className="notification-post-link" to={`/problems/${notification.relatedProblem._id}`} onClick={() => handleMarkAsRead(notification._id)}>
                                        View post: {notification.relatedProblem.title || "Open discussion"} →
                                    </Link>
                                )}
                                {(() => {
                                    const time = formatActivityTime(notification.createdAt);
                                    return <time className="notification-time" dateTime={notification.createdAt} title={time.full}>{time.relative} · {time.full}</time>;
                                })()}
                            </div>

                            {!notification.isRead && (
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleMarkAsRead(notification._id)}
                                >
                                    Mark as read
                                </button>
                            )}

                        </div>
                    </div>
                ))
            )}

        </div>
    );
};
export default Notifications;
