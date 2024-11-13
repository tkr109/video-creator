import React, { useState } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConvert = async () => {
    if (!text.trim()) {
      alert('Please enter some text!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error from backend:', errorText);
        alert('Failed to generate audio.');
        setLoading(false);
        return;
      }

      // Fetch audio as a Blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
    } catch (error) {
      console.error('Network error:', error.message);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
      <textarea
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        rows="5"
        placeholder="Enter your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      ></textarea>
      <button
        className={`w-full mt-4 py-2 px-4 rounded-lg text-white font-semibold ${
          loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
        onClick={handleConvert}
        disabled={loading}
      >
        {loading ? 'Converting...' : 'Convert to Speech'}
      </button>
      {audioUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Generated Speech:</h2>
          <audio className="w-full" src={audioUrl} controls></audio>
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;
