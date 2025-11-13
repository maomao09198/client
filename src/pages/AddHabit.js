import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';

const AddHabit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Morning',
    reminderTime: '',
    image: '',
    isPublic: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const habitData = {
        ...formData,
        userEmail: user.email,
        userName: user.displayName,
        completionHistory: [],
        currentStreak: 0
      };

      await axios.post(`${API_BASE_URL}/api/habits`, habitData);
      toast.success('Habit added successfully!');
      navigate('/my-habits');
    } catch (error) {
      toast.error('Failed to add habit: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2>Add New Habit</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Habit Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning Meditation"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your habit..."
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Morning">Morning</option>
              <option value="Work">Work</option>
              <option value="Fitness">Fitness</option>
              <option value="Evening">Evening</option>
              <option value="Study">Study</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reminder Time</label>
            <input
              type="time"
              name="reminderTime"
              value={formData.reminderTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
              Make this habit public
            </label>
          </div>

          <div className="form-group">
            <label>Your Email (Read-only)</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="read-only"
            />
          </div>

          <div className="form-group">
            <label>Your Name (Read-only)</label>
            <input
              type="text"
              value={user.displayName || 'Not set'}
              readOnly
              className="read-only"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Adding Habit...' : 'Add Habit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHabit;