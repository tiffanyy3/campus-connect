import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import './AvailabilitySelection.css';

function AvailabilitySelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [creatorName, setCreatorName] = useState('');
  const [availability, setAvailability] = useState({});
  const timeSlots = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, 'events', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent(docSnap.data());
      }
    };
    fetchEvent();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleTimeSlotChange = (date, time) => {
    setAvailability(prev => ({
      ...prev,
      [`${date}-${time}`]: !prev[`${date}-${time}`]
    }));
  };

  const handleSubmit = async () => {
    if (!creatorName.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, {
        creatorName,
        creatorAvailability: availability
      });
      navigate(`/share/${id}`);
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="availability-container">
      <div className="page-header">
        <h1>Select Your Availability</h1>
        <p className="flow-indicator">Step 2 of 3: Event Creator Availability</p>
      </div>

      <div className="event-details">
        <h2>{event.eventName}</h2>
        <p>Location: {event.location}</p>
      </div>

      <div className="creator-input">
        <label htmlFor="creatorName">Your Name:</label>
        <input
          id="creatorName"
          type="text"
          value={creatorName}
          onChange={(e) => setCreatorName(e.target.value)}
          placeholder="Enter your name"
          required
        />
      </div>

      <div className="dates-grid">
        {event.dates.sort().map(date => (
          <div key={date} className="date-column">
            <h3>{formatDate(date)}</h3>
            <div className="time-slots">
              {timeSlots.map(time => (
                <label key={`${date}-${time}`} className="time-slot">
                  <input
                    type="checkbox"
                    checked={availability[`${date}-${time}`] || false}
                    onChange={() => handleTimeSlotChange(date, time)}
                  />
                  <span>{time}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="submit-button">
        Submit Availability
      </button>
    </div>
  );
}

export default AvailabilitySelection;
