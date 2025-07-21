import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="p-4">Loading...</div>;

  // If user is logged in, show the component
  if (user) return children;

  // If not logged in, redirect to login page
  return <Navigate to="/login" />;
}
