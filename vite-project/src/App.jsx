import React from 'react';
import TextToSpeech from './components/TextToSpeech';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-8">🎥 Video Creator</h1>
      <TextToSpeech />
    </div>
  );
};

export default App;
