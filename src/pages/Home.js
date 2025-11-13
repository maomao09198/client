import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredHabits, setFeaturedHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedHabits = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/habits/public`);
        setFeaturedHabits(response.data);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedHabits();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="home">
      {/* Hero Banner */}
      <section className="hero">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Build Better Habits, Build Better Life
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Track your daily habits and build lasting routines for a better you
        </motion.p>
      </section>

      {/* Featured Habits Section */}
      <section className="featured-habits">
        <div className="container">
          <h2>Featured Habits</h2>
          <div className="habits-grid">
            {featuredHabits.length > 0 ? (
              featuredHabits.map((habit) => (
                <motion.div
                  key={habit._id}
                  className="habit-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3>{habit.title}</h3>
                  <p className="description">{habit.description}</p>
                  <div className="habit-meta">
                    <span className="category">{habit.category}</span>
                    <span className="creator">By: {habit.userName}</span>
                  </div>
                  <div className="streak-badge">
                    🔥 {habit.currentStreak || 0} day streak
                  </div>
                </motion.div>
              ))
            ) : (
              <p>No public habits available yet. Be the first to create one!</p>
            )}
          </div>
        </div>
      </section>

      {/* Why Build Habits Section */}
      <section className="benefits">
        <div className="container">
          <h2>Why Build Habits?</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Better Focus</h3>
              <p>Automate your routines for improved concentration and mental clarity</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">😌</div>
              <h3>Reduced Stress</h3>
              <p>Eliminate decision fatigue by establishing consistent patterns</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Long-term Growth</h3>
              <p>Small daily improvements compound into remarkable results over time</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Increased Productivity</h3>
              <p>Streamline your workflow and accomplish more with less effort</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 1 - How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Habits</h3>
              <p>Define your daily routines and set reminders</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Track Progress</h3>
              <p>Mark habits as complete and build streaks</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Achieve Goals</h3>
              <p>Watch your consistency turn into lasting change</p>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Section 2 - Call to Action */}
      <section className="cta">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Transform Your Life?</h2>
            <p>Start building better habits today and unlock your full potential</p>
            <button className="cta-button">Get Started Now</button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;