import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './ParticipantView.css';

function ParticipantView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participantName, setParticipantName] = useState('');
  const [availability, setAvailability] = useState({});
  const [submitted, setSubmitted] = useState(false);
  
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!participantName.trim()) {
      alert("Please enter your name");
      return;
    }

    try {
      const eventRef = doc(db, 'events', id);
      await updateDoc(eventRef, {
        participants: arrayUnion({
          name: participantName,
          availability
        })
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting availability:', error);
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="participant-container">
      <div className="page-header">
        <h1>Submit Your Availability</h1>
      </div>

      {!submitted ? (
        <>
          <div className="event-details">
            <h2>{event.eventName}</h2>
            <p>Location: {event.location}</p>
            <p>Created by: {event.creatorName}</p>
          </div>

          <div className="participant-input">
            <label htmlFor="participantName">Your Name:</label>
            <input
              id="participantName"
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
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
                    <label 
                      key={`${date}-${time}`} 
                      className={`time-slot ${
                        event.creatorAvailability[`${date}-${time}`] ? 'creator-available' : ''
                      }`}
                    >
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
        </>
      ) : (
        <div className="success-section">
          <h2>Thank you for submitting your availability!</h2>
          <p>Your response has been recorded.</p>
          <button 
            onClick={() => navigate(`/results/${id}`)} 
            className="view-results-button"
          >
            View Group Availability
          </button>
        </div>
      )}
    </div>
  );
}

export default ParticipantView;
