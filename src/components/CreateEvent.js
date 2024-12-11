import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import './CreateEvent.css';

function CreateEvent() {
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDates, setSelectedDates] = useState([]);
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const months = ["January", "February", "March", "April", "May", "June", 
                 "July", "August", "September", "October", "November", "December"];
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day);
    }

    return calendarDays;
  };

  const handleDateClick = (day) => {
    if (!day) return;
    
    const selectedDate = new Date(currentYear, currentMonth, day);
    selectedDate.setHours(0, 0, 0, 0);
    
    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (selectedDates.includes(dateString)) {
      setSelectedDates(selectedDates.filter(d => d !== dateString));
    } else {
      setSelectedDates([...selectedDates, dateString]);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDates.length === 0) {
      alert("Please select at least one date");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'events'), {
        eventName,
        location,
        dates: selectedDates.sort(),
        createdAt: new Date().toISOString()
      });
      navigate(`/availability/${docRef.id}`);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="create-event-container">
      <div className="page-header">
        <h1>Create Event</h1>
        <p className="flow-indicator">Step 1 of 3: Event Creation</p>
      </div>

      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
          className="event-input"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="event-input"
        />

        <div className="calendar-section">
          <h3>Select Possible Dates</h3>
          <div className="calendar-navigation">
            <button type="button" onClick={handlePrevMonth}>&lt;</button>
            <span>{months[currentMonth]} {currentYear}</span>
            <button type="button" onClick={handleNextMonth}>&gt;</button>
          </div>
          <div className="today-indicator">
            Today: {today.toLocaleDateString()}
          </div>
          <div className="calendar">
            <div className="weekdays">
              {days.map((day, index) => (
                <div key={index} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-grid">
              {generateCalendarDays().map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    !day ? 'empty' :
                    new Date(currentYear, currentMonth, day) < today ? 'past' :
                    selectedDates.includes(
                      new Date(currentYear, currentMonth, day)
                        .toISOString().split('T')[0]
                    ) ? 'selected' : 'future'
                  }`}
                  onClick={() => handleDateClick(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="submit-button">
          Create Event
        </button>
      </form>
    </div>
  );
}

export default CreateEvent;
