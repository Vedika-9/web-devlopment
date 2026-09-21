import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { therapist, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b border-line bg-paper/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/therapist/dashboard" className="font-serif text-xl text-ink">
          Unfazed
        </Link>
        {therapist && (
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/therapist/dashboard" className="hover:text-moss-600">Dashboard</Link>
            <Link to="/therapist/clients" className="hover:text-moss-600">Clients</Link>
            <Link to="/therapist/schedule" className="hover:text-moss-600">Schedule</Link>
            <Link to="/therapist/notes" className="hover:text-moss-600">Notes</Link>
            <Link to="/therapist/analytics" className="hover:text-moss-600">Analytics</Link>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-ink/50 hover:text-clay"
            >
              Sign out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
