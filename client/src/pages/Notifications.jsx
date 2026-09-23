import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setNotifications(notifications.map((n) => (n._id === notifId ? res.data : n)));
        } catch (err) {
            console.error(err);
        }
    };
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mt-5">

            <h1 className="mb-4">Notifications</h1>

            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                notifications.map((notification) => (
                    <div
                        key={notification._id}
                        className={
                            notification.isRead
                                ? "card mb-2"
                                : "card mb-2 border-primary"
                        }
                    >
                        <div className="card-body d-flex justify-content-between align-items-center">

                            <p className="mb-0">
                                {notification.message}
                            </p>

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