import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
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
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            />
            <button onClick={handleLogout}>Logout</button>
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