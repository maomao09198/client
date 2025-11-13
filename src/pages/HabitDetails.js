import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const HabitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [habit, setHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchHabitDetails();
  }, [id]);

  const fetchHabitDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/habits/${id}`);
      setHabit(response.data);
    } catch (error) {
      toast.error('Failed to fetch habit details');
      navigate('/browse-habits');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!user) {
      toast.error('Please login to track habits');
      return;
    }

    setUpdating(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const alreadyCompleted = habit.completionHistory.some(
        entry => entry.date === today
      );
      
      if (alreadyCompleted) {
        toast.error('You have already completed this habit today!');
        return;
      }

      const updatedHabit = {
        ...habit,
        completionHistory: [
          ...habit.completionHistory,
          { date: today, timestamp: new Date() }
        ]
      };

      await axios.put(`${API_BASE_URL}/api/habits/${id}`, updatedHabit);
      setHabit(updatedHabit);
      toast.success('Habit marked as complete for today! 🎉');
    } catch (error) {
      toast.error('Failed to mark habit as complete');
    } finally {
      setUpdating(false);
    }
  };

  const calculateStreak = (completionHistory) => {
    if (!completionHistory.length) return 0;
    
    const dates = completionHistory
      .map(entry => new Date(entry.date))
      .sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(currentDate.getDate() - i);
      
      const hasMatch = dates.some(date => 
        date.toDateString() === expectedDate.toDateString()
      );
      
      if (hasMatch) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateCompletionRate = () => {
    const last30Days = 30;
    const completedDays = habit.completionHistory.length;
    return Math.min((completedDays / last30Days) * 100, 100);
  };

  const getRecentCompletion = () => {
    const today = new Date();
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }
    
    return last7Days.map(date => ({
      date,
      completed: habit.completionHistory.some(entry => entry.date === date)
    }));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!habit) {
    return (
      <div className="page-container">
        <div className="error-state">
          <h2>Habit Not Found</h2>
          <p>The habit you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/browse-habits')} className="btn-primary">
            Browse Public Habits
          </button>
        </div>
      </div>
    );
  }

  const currentStreak = calculateStreak(habit.completionHistory);
  const completionRate = calculateCompletionRate();
  const recentCompletion = getRecentCompletion();

  return (
    <div className="page-container">
      <div className="habit-details-container">
        {/* Header Section */}
        <div className="habit-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← Back
          </button>
          <h1>{habit.title}</h1>
          <div className="streak-badge-large">
            🔥 {currentStreak} Day Streak
          </div>
        </div>

        <div className="habit-details-grid">
          {/* Main Content */}
          <div className="habit-main-content">
            {habit.image && (
              <div className="habit-image-large">
                <img src={habit.image} alt={habit.title} />
              </div>
            )}

            <div className="habit-info-card">
              <h3>About This Habit</h3>
              <p className="habit-description">{habit.description}</p>
              
              <div className="habit-meta-grid">
                <div className="meta-item">
                  <span className="meta-label">Category</span>
                  <span className={`category-badge ${habit.category.toLowerCase()}`}>
                    {habit.category}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Reminder Time</span>
                  <span className="meta-value">
                    {habit.reminderTime || 'Not set'}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Created</span>
                  <span className="meta-value">
                    {new Date(habit.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="meta-item">
                  <span className="meta-label">Total Completions</span>
                  <span className="meta-value">
                    {habit.completionHistory.length} times
                  </span>
                </div>
              </div>

              {/* Mark Complete Button */}
              <div className="action-section">
                <button 
                  onClick={handleMarkComplete}
                  disabled={updating}
                  className="mark-complete-btn"
                >
                  {updating ? 'Updating...' : '✅ Mark as Complete for Today'}
                </button>
                <p className="action-note">
                  Track your progress by marking this habit complete each day you do it.
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="progress-card">
              <h3>Your Progress</h3>
              <div className="progress-stats">
                <div className="progress-stat">
                  <span className="stat-value">{currentStreak}</span>
                  <span className="stat-label">Current Streak</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-value">{habit.completionHistory.length}</span>
                  <span className="stat-label">Total Completions</span>
                </div>
                <div className="progress-stat">
                  <span className="stat-value">{Math.round(completionRate)}%</span>
                  <span className="stat-label">30-Day Completion</span>
                </div>
              </div>

              <div className="progress-visual">
                <div className="progress-bar-large">
                  <div 
                    className="progress-fill-large"
                    style={{ width: `${completionRate}%` }}
                  ></div>
                </div>
                <span className="progress-text">
                  {habit.completionHistory.length} out of 30 days completed
                </span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="habit-sidebar">
            {/* Creator Info */}
            <div className="creator-card">
              <h3>Habit Creator</h3>
              <div className="creator-details">
                <div className="creator-avatar">
                  {habit.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="creator-info">
                  <strong>{habit.userName}</strong>
                  <span>{habit.userEmail}</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-card">
              <h3>Last 7 Days</h3>
              <div className="activity-grid">
                {recentCompletion.map((day, index) => (
                  <div 
                    key={day.date}
                    className={`activity-day ${day.completed ? 'completed' : 'missed'}`}
                    title={new Date(day.date).toLocaleDateString()}
                  >
                    {day.completed ? '✓' : '○'}
                  </div>
                ))}
              </div>
              <p className="activity-note">
                {recentCompletion.filter(day => day.completed).length} of 7 days completed
              </p>
            </div>

            {/* Quick Stats */}
            <div className="stats-card">
              <h3>Quick Stats</h3>
              <div className="stats-list">
                <div className="stat-item">
                  <span>Best Streak:</span>
                  <strong>{currentStreak} days</strong>
                </div>
                <div className="stat-item">
                  <span>Success Rate:</span>
                  <strong>{Math.round(completionRate)}%</strong>
                </div>
                <div className="stat-item">
                  <span>Public:</span>
                  <strong>{habit.isPublic ? 'Yes' : 'No'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitDetails;