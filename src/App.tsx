import { useState, useEffect } from "react";

export default function ReadingAssistApp() {
  const [text, setText] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speed, setSpeed] = useState(2000);
  const [speechRate, setSpeechRate] = useState(1.0);

  useEffect(() => {
    let interval: number | undefined;
    if (isReading && currentIndex < filteredWords.length) {
      if (isSpeaking && filteredWords[currentIndex]) {
        const utterance = new SpeechSynthesisUtterance(filteredWords[currentIndex]);
        utterance.rate = speechRate;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
      interval = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, speed);
    }
    return () => clearTimeout(interval);
  }, [isReading, currentIndex, filteredWords, isSpeaking, speed, speechRate]);

  const startReading = () => {
    const allWords = text.split(/(\s+)/);
    const nonEmptyWords = allWords.filter(word => word.trim() !== "");
    setWords(allWords);
    setFilteredWords(nonEmptyWords);
    setCurrentIndex(0);
    setIsReading(true);
  };

  const pauseReading = () => setIsReading(false);
  const resumeReading = () => setIsReading(true);
  const stopReading = () => {
    setIsReading(false);
    setCurrentIndex(0);
    speechSynthesis.cancel();
  };

  useEffect(() => {
    setWords(text.split(/(\s+)/));
    setFilteredWords(text.split(/(\s+)/).filter(word => word.trim() !== ""));
  }, [text]);

  const getHighlightedText = () => {
    let highlightIndex = 0;
    return words.map((word, index) => {
      if (word.trim() !== "") {
        const isHighlighted = highlightIndex === currentIndex;
        highlightIndex++;
        return (
          <span key={index} className={isHighlighted ? "bg-yellow-300" : ""}>
            {word}
          </span>
        );
      }
      return <span key={index}>{word}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 p-10 bg-gray-300 min-h-screen">
      {isReading ? (
        <div className="w-full p-4 border rounded-md bg-white text-gray-800 min-h-[100px] whitespace-pre-wrap text-xl">
          {getHighlightedText()}
        </div>
      ) : (
        <textarea
          className="w-full p-4 border rounded-md text-xl"
          rows={4}
          placeholder="Enter text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <div className="flex gap-4 text-xl">
        <button className="px-6 py-3 text-lg bg-blue-500 text-white" onClick={startReading} disabled={!text.trim()}>Start</button>
        <button className="px-6 py-3 text-lg bg-yellow-500 text-white" onClick={pauseReading} disabled={!text.trim()}>Pause</button>
        <button className="px-6 py-3 text-lg bg-green-500 text-white" onClick={resumeReading} disabled={!text.trim()}>Resume</button>
        <button className="px-6 py-3 text-lg bg-red-500 text-white" onClick={stopReading} disabled={!text.trim()}>Stop</button>
        <label className="flex items-center gap-3 text-xl">
          <span>Voice</span>
          <input type="checkbox" className="scale-150" checked={isSpeaking} onChange={() => setIsSpeaking(!isSpeaking)} />
        </label>
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border-2 border-gray-500 mt-4 text-xl">
        <label className="flex items-center gap-4">
          <span className="text-gray-700">Speech Rate:</span>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="w-16 text-right font-medium">{speechRate.toFixed(1)}x</span>
        </label>
      </div>
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border-2 border-gray-500 mt-4 text-xl">
        <label className="flex items-center gap-4">
          <span className="text-gray-700">Reading Speed:</span>
          <input
            type="range"
            min={1500}
            max={3000}
            step={100}
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="w-16 text-right font-medium">{speed} ms</span>
        </label>
      </div>
      <div className="mt-8 w-full max-w-2xl text-center">
        <div className="text-8xl font-bold text-gray-800 min-h-[150px] flex items-center justify-center">
          {currentIndex >= 0 && filteredWords[currentIndex]}
        </div>
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";

// export default function ReadingAssistApp() {
//   const [text, setText] = useState("");
//   const [words, setWords] = useState<string[]>([]);
//   const [filteredWords, setFilteredWords] = useState<string[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isReading, setIsReading] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [speed, setSpeed] = useState(2000);
//   const [speechRate, setSpeechRate] = useState(1.0);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;
//     if (isReading && currentIndex < filteredWords.length) {
//       if (isSpeaking && filteredWords[currentIndex]) {
//         const utterance = new SpeechSynthesisUtterance(filteredWords[currentIndex]);
//         utterance.rate = speechRate;
//         speechSynthesis.cancel();
//         speechSynthesis.speak(utterance);
//       }
//       interval = setTimeout(() => {
//         setCurrentIndex((prev) => prev + 1);
//       }, speed);
//     }
//     return () => clearTimeout(interval);
//   }, [isReading, currentIndex, filteredWords, isSpeaking, speed, speechRate]);

//   const startReading = () => {
//     const allWords = text.split(/(\s+)/);
//     const nonEmptyWords = allWords.filter(word => word.trim() !== "");
//     setWords(allWords);
//     setFilteredWords(nonEmptyWords);
//     setCurrentIndex(0);
//     setIsReading(true);
//   };

//   const pauseReading = () => setIsReading(false);
//   const resumeReading = () => setIsReading(true);
//   const stopReading = () => {
//     setIsReading(false);
//     setCurrentIndex(0);
//     speechSynthesis.cancel();
//   };

//   useEffect(() => {
//     setWords(text.split(/(\s+)/));
//     setFilteredWords(text.split(/(\s+)/).filter(word => word.trim() !== ""));
//   }, [text]);

//   const getHighlightedText = () => {
//     let highlightIndex = 0;
//     return words.map((word, index) => {
//       if (word.trim() !== "") {
//         const isHighlighted = highlightIndex === currentIndex;
//         highlightIndex++;
//         return (
//           <span key={index} className={isHighlighted ? "bg-yellow-300" : ""}>
//             {word}
//           </span>
//         );
//       }
//       return <span key={index}>{word}</span>;
//     });
//   };

//   return (
//     <div className="flex flex-col items-center gap-6 p-10 bg-gray-300 min-h-screen">
//       {isReading ? (
//         <div className="w-full p-4 border rounded-md bg-white text-gray-800 min-h-[100px] whitespace-pre-wrap text-xl">
//           {getHighlightedText()}
//         </div>
//       ) : (
//         <textarea
//           className="w-full p-4 border rounded-md text-xl"
//           rows={4}
//           placeholder="Enter text here..."
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//         />
//       )}
//       <div className="flex gap-4 text-xl">
//         <Button className="px-6 py-3 text-lg bg-blue-500 text-white" onClick={startReading} disabled={!text.trim()}>Start</Button>
//         <Button className="px-6 py-3 text-lg bg-yellow-500 text-white" onClick={pauseReading} disabled={!text.trim()}>Pause</Button>
//         <Button className="px-6 py-3 text-lg bg-green-500 text-white" onClick={resumeReading} disabled={!text.trim()}>Resume</Button>
//         <Button className="px-6 py-3 text-lg bg-red-500 text-white" onClick={stopReading} disabled={!text.trim()}>Stop</Button>
//         <label className="flex items-center gap-3 text-xl">
//           <span>Voice</span>
//           <Switch className="scale-150" checked={isSpeaking} onCheckedChange={setIsSpeaking} />
//         </label>
//       </div>
//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border-2 border-gray-500 mt-4 text-xl">
//         <label className="flex items-center gap-4">
//           <span className="text-gray-700">Speech Rate:</span>
//           <input
//             type="range"
//             min="1"
//             max="2"
//             step="0.1"
//             value={speechRate}
//             onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
//             className="flex-1"
//           />
//           <span className="w-16 text-right font-medium">{speechRate.toFixed(1)}x</span>
//         </label>
//       </div>
//       <div className="w-full max-w-md bg-white p-6 rounded-lg shadow border-2 border-gray-500 mt-4 text-xl">
//         <label className="flex items-center gap-4">
//           <span className="text-gray-700">Reading Speed:</span>
//           <input
//             type="range"
//             min={1500}
//             max={3000}
//             step={100}
//             value={speed}
//             onChange={(e) => setSpeed(parseInt(e.target.value))}
//             className="flex-1"
//           />
//           <span className="w-16 text-right font-medium">{speed} ms</span>
//         </label>
//       </div>
//       <div className="mt-8 w-full max-w-2xl text-center">
//         <div className="text-8xl font-bold text-gray-800 min-h-[150px] flex items-center justify-center">
//           {currentIndex >= 0 && filteredWords[currentIndex]}
//         </div>
//       </div>
//     </div>
//   );
// }
