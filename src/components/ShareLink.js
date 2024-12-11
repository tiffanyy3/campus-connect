import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './ShareLink.css';

function ShareLink() {
  const navigate = useNavigate();  // Add this line
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const shareableLink = `${window.location.origin}/event/${id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div className="share-container">
      <div className="page-header">
        <h1>Share Your Event</h1>
        <p className="flow-indicator">Step 3 of 3: Share with Participants</p>
      </div>

      <div className="event-details">
        <h2>{event.eventName}</h2>
        <p>Location: {event.location}</p>
      </div>

      <div className="share-section">
        <h3>Share this link with your group</h3>
        <div className="link-container">
          <input
            type="text"
            value={shareableLink}
            readOnly
            className="link-input"
          />
          <button 
            onClick={handleCopyLink}
            className="copy-button"
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>

      <div className="view-results-section">
        <button 
          onClick={() => navigate(`/results/${id}`)} 
          className="view-results-button"
        >
          View Group Availability
        </button>
      </div>

    </div>
  );
}

export default ShareLink;
