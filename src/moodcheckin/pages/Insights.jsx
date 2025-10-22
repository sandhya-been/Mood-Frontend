import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, startOfWeek, startOfMonth } from 'date-fns';
import styles from '../styles/Insights.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const emotionColors = {
  Happy: '#92c582',
  Content: '#ffb356',
  Neutral: '#7accc8',
  Sad: '#6b88c9',
  Angry: '#ff4a4a',
  Awe: '#c792ea'
};

function Insights() {
  const [view, setView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [moodData, setMoodData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoodData();
  }, [view, selectedDate]);

  const fetchMoodData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.token) {
        setError('Please login to view insights');
        return;
      }

      let startDate, endDate;
      if (view === 'daily') {
        startDate = format(selectedDate, "yyyy-MM-dd'T'00:00:00.000'Z'");
        endDate = format(selectedDate, "yyyy-MM-dd'T'23:59:59.999'Z'");
      } else if (view === 'weekly') {
        const weekStart = startOfWeek(selectedDate);
        startDate = format(weekStart, "yyyy-MM-dd'T'00:00:00.000'Z'");
        endDate = format(selectedDate, "yyyy-MM-dd'T'23:59:59.999'Z'");
      } else {
        const monthStart = startOfMonth(selectedDate);
        startDate = format(monthStart, "yyyy-MM-dd'T'00:00:00.000'Z'");
        endDate = format(selectedDate, "yyyy-MM-dd'T'23:59:59.999'Z'");
      }

      const response = await fetch(
        `http://localhost:5000/api/moods/insights?startDate=${startDate}&endDate=${endDate}&view=${view}`,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch mood data');
      const data = await response.json();
      setMoodData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEmotionDistribution = () => {
    if (!moodData?.emotionCounts) return null;

    const data = {
      labels: Object.keys(moodData.emotionCounts),
      datasets: [{
        data: Object.values(moodData.emotionCounts),
        backgroundColor: Object.keys(moodData.emotionCounts).map(emotion => emotionColors[emotion]),
        borderWidth: 1
      }]
    };

    return (
      <div className={styles.chartContainer}>
        <h3>Emotion Distribution</h3>
        <Doughnut 
          data={data}
          options={{
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }}
        />
      </div>
    );
  };

  const renderActivityImpact = () => {
    if (!moodData?.activityImpact) return null;

    const data = {
      labels: Object.keys(moodData.activityImpact),
      datasets: [{
        label: 'Activity Impact on Mood',
        data: Object.values(moodData.activityImpact),
        backgroundColor: '#4a154b'
      }]
    };

    return (
      <div className={styles.chartContainer}>
        <h3>Activity Impact</h3>
        <Bar 
          data={data}
          options={{
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>
    );
  };

  if (loading) return <div className={styles.loading}>Loading insights...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Mood Insights</h1>

        <div className={styles.controls}>
          <div className={styles.viewToggle}>
            {['daily', 'weekly', 'monthly'].map(viewOption => (
              <button
                key={viewOption}
                className={`${styles.viewButton} ${view === viewOption ? styles.active : ''}`}
                onClick={() => setView(viewOption)}
              >
                {viewOption.charAt(0).toUpperCase() + viewOption.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.dateSelector}>
            {view === 'daily' && (
              <input
                type="date"
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className={styles.dateInput}
              />
            )}
            {view === 'weekly' && (
              <input
                type="week"
                value={`${format(selectedDate, 'yyyy')}-W${format(selectedDate, 'ww')}`}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className={styles.weekInput}
              />
            )}
            {view === 'monthly' && (
              <input
                type="month"
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className={styles.monthInput}
              />
            )}
          </div>
        </div>

        <div className={styles.chartsGrid}>
          {renderEmotionDistribution()}
          {renderActivityImpact()}
        </div>
      </div>
    </div>
  );
}

export default Insights;