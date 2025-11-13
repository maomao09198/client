import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="navbar">
      <div className="nav-brand">
        <Link to="/">HabitTracker</Link>
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        {user && <Link to="/add-habit">Add Habit</Link>}
        {user && <Link to="/my-habits">My Habits</Link>}
        <Link to="/browse-habits">Browse Habits</Link>
        
        {user ? (
          <div className="user-menu">
            <img 
              src={user.photoURL || '/default-avatar.png'} 
              alt={user.displayName}
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown-menu">
                <p>👤 {user.displayName}</p>
                <p>📧 {user.email}</p>
                <button onClick={handleLogout}>🚪 Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login">Login</Link>
            <Link to="/register">Signup</Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;