import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateEvent from './components/CreateEvent';
import AvailabilitySelection from './components/AvailabilitySelection';
import ShareLink from './components/ShareLink';
import ParticipantView from './components/ParticipantView';
import ResultsView from './components/ResultsView';
import Navigation from './components/Navigation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Campus Connect</h1>
        </header>
        <main className="main-content">
          <Navigation />
          <Routes>
            <Route path="/" element={<CreateEvent />} />
            <Route path="/availability/:id" element={<AvailabilitySelection />} />
            <Route path="/share/:id" element={<ShareLink />} />
            <Route path="/event/:id" element={<ParticipantView />} />
            <Route path="/results/:id" element={<ResultsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
