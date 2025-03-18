import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
//import { Switch } from "@/components/ui/switch";
// import './index.css'

export default function ReadingAssistApp() {
  const [text, setText] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [showInput, setShowInput] = useState(true);
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | null = null;
    if (isReading && currentIndex < filteredWords.length) {
      interval = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    } else if (currentIndex >= filteredWords.length) {
      setIsReading(false);
      setShowInput(true);
      setShowOutput(false);
    }
    return () => {
      if (interval) clearTimeout(interval);
      };
    }, [isReading, currentIndex, filteredWords, speed]);

  const startReading = () => {
    const allWords = text.split(/(\s+)/);
    const nonEmptyWords = allWords.filter(word => word.trim() !== "");
    setWords(allWords);
    setFilteredWords(nonEmptyWords);
    setCurrentIndex(0);
    setIsReading(true);
    setShowInput(false);
    setShowOutput(true);
  };

  const pauseReading = () => {
    setIsReading(false);
    setShowInput(true);
  };

  const resumeReading = () => {
    setIsReading(true);
    setShowInput(false);
  };

  const stopReading = () => {
    setIsReading(false);
    setShowInput(true);
    setShowOutput(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    setWords(text.split(/(\s+)/));
    setFilteredWords(text.split(/(\s+)/).filter(word => word.trim() !== ""));
  }, [text]);

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-6 p-10 bg-gray-500 min-h-screen">
      {/* Page Title */}
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
        UC Reading Assist App
      </h1>

      {showInput && (
        <textarea
            className="w-full p-4 border-2 shadow rounded-md text-xl bg-gray-100 text-black"
            rows={4}
            placeholder="Please Enter text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
      )}
      {showOutput && (
        <div className="mt-8 w-full max-w-2xl text-center bg-white rounded-lg border-2 shadow p-6">
          <div className="text-8xl font-bold text-black min-h-[150px] flex items-center justify-center">
            {currentIndex >= 0 && currentIndex < filteredWords.length ? filteredWords[currentIndex] : ""}
          </div>
        </div>
      )}
      <div className="flex gap-4 text-2xl mt-4">
        <Button className="px-6 py-3 text-lg bg-blue-700 text-white" onClick={startReading} disabled={!text.trim()}>Start</Button>
        <Button className="px-6 py-3 text-lg bg-yellow-600 text-white" onClick={pauseReading} disabled={!text.trim()}>Pause</Button>
        <Button className="px-6 py-3 text-lg bg-green-600 text-white" onClick={resumeReading} disabled={!text.trim()}>Resume</Button>
        <Button className="px-6 py-3 text-lg bg-red-700 text-white" onClick={stopReading} disabled={!text.trim()}>Stop</Button>
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border-2 border-gray-500 mt-4 text-xl">
        <label className="flex items-center gap-4">
          <span className="text-gray-700">Reading Speed:</span>
          <input
            type="range"
            min={150}
            max={3000}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-16 text-right text-gray-700 font-medium">{speed}ms</span>
        </label>
      </div>
    </div>
  );
}