import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const MyHabits = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/habits/user/${user.email}`);
      setHabits(response.data);
    } catch (error) {
      toast.error('Failed to fetch habits');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (habitId) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/habits/${habitId}`);
      setHabits(habits.filter(habit => habit._id !== habitId));
      toast.success('Habit deleted successfully');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  const handleMarkComplete = async (habitId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const habit = habits.find(h => h._id === habitId);
      
      const alreadyCompleted = habit.completionHistory.some(
        entry => entry.date === today
      );
      
      if (alreadyCompleted) {
        toast.error('Habit already completed today');
        return;
      }

      const updatedHabit = {
        ...habit,
        completionHistory: [
          ...habit.completionHistory,
          { date: today, timestamp: new Date() }
        ]
      };

      await axios.put(`${API_BASE_URL}/api/habits/${habitId}`, updatedHabit);
      setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
      toast.success('Habit marked as complete!');
    } catch (error) {
      toast.error('Failed to mark habit as complete');
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

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-container">
      <div className="habits-container">
        <h2>My Habits</h2>
        
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any habits yet.</p>
            <a href="/add-habit" className="btn-primary">Create Your First Habit</a>
          </div>
        ) : (
          <div className="habits-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Current Streak</th>
                  <th>Created Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {habits.map(habit => (
                  <tr key={habit._id}>
                    <td>
                      <strong>{habit.title}</strong>
                      <br />
                      <small>{habit.description}</small>
                    </td>
                    <td>
                      <span className={`category-badge ${habit.category.toLowerCase()}`}>
                        {habit.category}
                      </span>
                    </td>
                    <td>
                      <div className="streak-display">
                        🔥 {calculateStreak(habit.completionHistory)} days
                      </div>
                    </td>
                    <td>
                      {new Date(habit.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-complete"
                          onClick={() => handleMarkComplete(habit._id)}
                        >
                          ✅ Complete
                        </button>
                        <button 
                          className="btn-update"
                          onClick={() => window.location.href = `/habit/${habit._id}`}
                        >
                          ✏️ Update
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDelete(habit._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyHabits;