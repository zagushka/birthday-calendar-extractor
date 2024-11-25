import Analytics from "@/libs/analytics";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    Analytics.firePageViewEvent(location.pathname, location.pathname + location.search);
  }, [location]);

}

export default usePageTracking;