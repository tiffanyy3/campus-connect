import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import Layout from './Layout';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEvent(docSnap.data());
      } else {
        navigate('/');
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleAvailabilitySelect = ({ start, end }) => {
    setAvailability([...availability, { start, end }]);
  };

  const handleSubmit = async () => {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, {
      creatorAvailability: availability
    });
    navigate(`/event/${id}/participate`);
  };

  if (!event) return <div>Loading...</div>;

  return (
    <Layout title="Set Your Availability">
      <div className="event-card">
        <h2 className="card-title">{event.name}</h2>
        <p>Location: {event.location}</p>
        <div className="calendar-container">
          <Calendar
            localizer={localizer}
            events={availability}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleAvailabilitySelect}
            min={new Date(event.dateRange.startDate).setHours(8, 0, 0)}
            max={new Date(event.dateRange.startDate).setHours(22, 0, 0)}
          />
        </div>
        <button onClick={handleSubmit} className="submit-button">Submit Availability</button>
      </div>
    </Layout>
  );
}

export default EventDetails;
