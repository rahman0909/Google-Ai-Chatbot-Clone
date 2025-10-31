import React, { useState } from 'react';

interface ImageInputProps {
  onGenerateImage: (prompt: string, aspectRatio: string) => void;
  isLoading: boolean;
}

const aspectRatios = ["1:1", "3:4", "4:3", "9:16", "16:9"];

const ImageInput: React.FC<ImageInputProps> = ({ onGenerateImage, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerateImage(prompt.trim(), aspectRatio);
      setPrompt('');
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt to generate an image..."
          rows={2}
          className="w-full bg-gray-700 rounded-lg p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none transition-all duration-200 max-h-48"
          disabled={isLoading}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label htmlFor="aspect-ratio" className="text-gray-400 text-sm">Aspect Ratio:</label>
            <select
              id="aspect-ratio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={isLoading}
              className="bg-gray-700 text-gray-200 rounded-md p-1 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {aspectRatios.map(ratio => (
                <option key={ratio} value={ratio}>{ratio}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageInput;
