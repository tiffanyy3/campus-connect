import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './ResultsView.css';

function ResultsView() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
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

  const getAvailabilityCount = (date, time) => {
    let count = 0;
    const timeSlot = `${date}-${time}`;
    
    if (event.creatorAvailability[timeSlot]) count++;
    
    event.participants?.forEach(participant => {
      if (participant.availability[timeSlot]) count++;
    });
    
    return count;
  };

  const getAvailableParticipants = (date, time) => {
    const available = [];
    const timeSlot = `${date}-${time}`;
    
    if (event.creatorAvailability[timeSlot]) {
      available.push(event.creatorName);
    }
    
    event.participants?.forEach(participant => {
      if (participant.availability[timeSlot]) {
        available.push(participant.name);
      }
    });
    
    return available;
  };

  if (!event) return <div>Loading...</div>;

  const totalParticipants = 1 + (event.participants?.length || 0);

  return (
    <div className="results-container">
      <div className="event-details">
        <h2>{event.eventName}</h2>
        <p>Location: {event.location}</p>
        <p>Created by: {event.creatorName}</p>
        <p>Total Participants: {totalParticipants}</p>
      </div>

      <div className="availability-grid">
        {event.dates.sort().map(date => (
          <div key={date} className="date-column">
            <h3>{new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric'
            })}</h3>
            <div className="time-slots">
              {timeSlots.map(time => {
                const count = getAvailabilityCount(date, time);
                const availableParticipants = getAvailableParticipants(date, time);
                return (
                  <div 
                    key={`${date}-${time}`} 
                    className={`time-slot ${
                      count === totalParticipants ? 'all-available' :
                      count > 0 ? 'some-available' : ''
                    }`}
                  >
                    <div className="time">{time}</div>
                    <div className="count">{count}/{totalParticipants} available</div>
                    <div className="participants">
                      {availableParticipants.map(participant => (
                        <span key={participant}>{participant}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsView;
