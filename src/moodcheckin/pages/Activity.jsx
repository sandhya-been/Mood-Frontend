import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfMonth,
  startOfMonth,
  addDays,
  parseISO, 
  subMonths, 
  eachWeekOfInterval, 
  startOfYear, 
  endOfYear 
} from 'date-fns';
import { RiEmotionSadLine } from 'react-icons/ri';
import styles from '../styles/Activity.module.css';

function Activity() {
  const [moods, setMoods] = useState([]);
  const [view, setView] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMoods();
  }, [selectedDate, view]);

  const fetchMoods = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.token) {
        setError('Please login to view your activity');
        return;
      }

      let startDate, endDate;
      if (view === 'daily') {
        // Set start of day and end of day for complete 24 hour period
        const selectedDay = new Date(selectedDate);
        startDate = format(selectedDay.setHours(0, 0, 0, 0), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
        endDate = format(selectedDay.setHours(23, 59, 59, 999), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      } else if (view === 'weekly') {
        startDate = format(startOfWeek(selectedDate), 'yyyy-MM-dd');
        const weekEnd = addDays(startOfWeek(selectedDate), 6);
        endDate = format(weekEnd, 'yyyy-MM-dd');
      } else if (view === 'monthly') {
        startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
        endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
      }

      // Update URL to include timezone offset
      const response = await fetch(
        `http://localhost:5000/api/moods/user?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&view=${view}`,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch moods');
      
      const data = await response.json();
      setMoods(data);
      setCurrentPage(1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderMoodCard = (mood) => (
    <div key={mood._id} className={styles.moodBox}>
      <div className={styles.moodDate}>
        {format(new Date(mood.date), 'MMM dd')}
      </div>
      
      <div className={styles.moodContent}>
        <div className={styles.emotionsSection}>
          <h4>Emotions</h4>
          <div className={styles.emotionsList}>
            {mood.emotions.map((emotion, idx) => (
              <div 
                key={idx} 
                className={styles.emotionItem}
                style={{ borderColor: emotion.color }}
              >
                <span className={styles.emotionName}>{emotion.emotion}</span>
              </div>
            ))}
          </div>
        </div>

        {mood.reflection && (
          <div className={styles.reflectionSection}>
            <h4>Reflection</h4>
            <p className={styles.reflectionText}>{mood.reflection}</p>
          </div>
        )}

        {mood.activities?.length > 0 && (
          <div className={styles.activitiesSection}>
            <h4>Activities</h4>
            <div className={styles.activitiesList}>
              {mood.activities.map((activity, idx) => (
                <span key={idx} className={styles.activityTag}>
                  {activity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const getWeeksOfYear = () => {
    const start = startOfYear(new Date());
    const end = endOfYear(new Date());
    
    return eachWeekOfInterval({ start, end }).map(weekStart => ({
      date: weekStart,
      label: `Week of ${format(weekStart, 'MMM dd, yyyy')}`
    }));
  };

  const getNoDataMessage = () => {
    switch(view) {
      case 'daily':
        return `No mood entries found for ${format(selectedDate, 'MMMM dd, yyyy')}`;
      case 'weekly':
        const weekStart = startOfWeek(selectedDate);
        return `No mood entries found for week of ${format(weekStart, 'MMMM dd, yyyy')}`;
      case 'monthly':
        return `No mood entries found for ${format(selectedDate, 'MMMM yyyy')}`;
      default:
        return 'No mood entries found for this period';
    }
  };

  const renderNoData = () => (
    <div className={styles.noData}>
      <div className={styles.noDataContent}>
        <RiEmotionSadLine className={styles.emptyIcon} />
        <p className={styles.noDataText}>{getNoDataMessage()}</p>
        <button 
          onClick={() => setSelectedDate(new Date())} 
          className={styles.todayButton}
        >
          View Today's Entries
        </button>
      </div>
    </div>
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const totalPages = Math.ceil(moods.length / itemsPerPage);
  const paginatedMoods = moods.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.title}>Reports</h1>
        
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
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                className={styles.dateInput}
              />
            )}
            {view === 'weekly' && (
              <select
                value={format(selectedDate, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                className={styles.weekSelect}
              >
                {getWeeksOfYear().map((week, i) => (
                  <option key={i} value={format(week.date, 'yyyy-MM-dd')}>
                    {week.label}
                  </option>
                ))}
              </select>
            )}
            {view === 'monthly' && (
              <input
                type="month"
                value={format(selectedDate, 'yyyy-MM')}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
                className={styles.monthInput}
              />
            )}
          </div>
        </div>

        <div className={styles.moodGrid}>
          {paginatedMoods.length > 0 ? (
            paginatedMoods.map(renderMoodCard)
          ) : (
            renderNoData()
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Activity;