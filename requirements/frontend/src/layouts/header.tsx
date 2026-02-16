import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import icon from "../assets/icon2.png";
import letters from "../assets/letters.png";

export default function Header() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();          // clears auth state (+ localStorage if you do it there)
    navigate("/");     // send user somewhere safe after logout
  }

  return (
    <header className="border-b border-gray-200 bg-surface relative z-[100]">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex items-center gap-2">
          <img src={icon} alt="icon" className="h-5 w-auto" />
          <img src={letters} alt="You Draw Me Crazy" className="h-12 w-auto" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm text-textMuted">
          <Link to="/" className="hover:text-textPrimary transition-colors">
            Home
          </Link>
          <Link to="/play" className="hover:text-textPrimary transition-colors">
            Play
          </Link>
          <Link to="/about" className="hover:text-textPrimary transition-colors">
            About
          </Link>

          {/* Auth placeholders */}
          {auth ? (
            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/profile"
                className="hover:text-textPrimary transition-colors"
              >
                Profile
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="rounded-md bg-primary px-3 py-1.5 text-textPrimary hover:bg-primary/80 transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 ml-4">
              <Link
                to="/login"
                className="hover:text-textPrimary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/sign-up"
                className="rounded-md bg-gray-900 px-3 py-1.5 text-white hover:bg-gray-800 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
