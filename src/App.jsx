import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PromptLibrary from './pages/PromptLibrary';
import PromptTester from './pages/PromptTester';
import PromptDetail from './pages/PromptDetail';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<PromptLibrary />} />
          <Route path="/tester" element={<PromptTester />} />
          <Route path="/prompt/:id" element={<PromptDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;