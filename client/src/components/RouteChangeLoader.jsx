import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";

const RouteChangeLoader = () => {
    const location = useLocation();
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setVisible(true);
        const timeout = window.setTimeout(() => setVisible(false), 450);
        return () => window.clearTimeout(timeout);
    }, [location.key]);

    return visible ? <LoadingScreen fullScreen message="Taking you there…" /> : null;
};

export default RouteChangeLoader;
