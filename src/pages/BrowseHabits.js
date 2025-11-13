import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const BrowseHabits = () => {
  const [habits, setHabits] = useState([]);
  const [filteredHabits, setFilteredHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Morning', 'Work', 'Fitness', 'Evening', 'Study'];

  useEffect(() => {
    fetchPublicHabits();
  }, []);

  useEffect(() => {
    filterHabits();
  }, [habits, searchTerm, selectedCategory]);

  const fetchPublicHabits = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/habits/browse`);
      setHabits(response.data);
    } catch (error) {
      toast.error('Failed to fetch public habits');
    } finally {
      setLoading(false);
    }
  };

  const filterHabits = () => {
    let filtered = habits;

    if (searchTerm) {
      filtered = filtered.filter(habit =>
        habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        habit.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(habit => habit.category === selectedCategory);
    }

    setFilteredHabits(filtered);
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
      <div className="browse-container">
        <h2>Browse Public Habits</h2>
        <p className="subtitle">Get inspired by habits from other users</p>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search habits by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing {filteredHabits.length} of {habits.length} habits
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Habits Grid */}
        {filteredHabits.length === 0 ? (
          <div className="empty-state">
            <p>No habits found matching your criteria.</p>
            <p>Try changing your search or filter settings.</p>
          </div>
        ) : (
          <div className="browse-grid">
            {filteredHabits.map(habit => (
              <div key={habit._id} className="habit-card-browse">
                {habit.image && (
                  <div className="habit-image">
                    <img src={habit.image} alt={habit.title} />
                  </div>
                )}
                
                <div className="habit-content">
                  <h3>{habit.title}</h3>
                  <p className="habit-description">{habit.description}</p>
                  
                  <div className="habit-meta">
                    <span className={`category-badge ${habit.category.toLowerCase()}`}>
                      {habit.category}
                    </span>
                    <span className="streak-badge">
                      🔥 {calculateStreak(habit.completionHistory)} day streak
                    </span>
                  </div>

                  <div className="creator-info">
                    <span>Created by: {habit.userName}</span>
                    <span className="created-date">
                      {new Date(habit.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="completion-stats">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{
                          width: `${(habit.completionHistory.length / 30) * 100}%`
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {habit.completionHistory.length}/30 days completed
                    </span>
                  </div>

                  <Link to={`/habit/${habit._id}`} className="view-details-btn">
                    View Details & Track
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseHabits;