import React, { useState, useEffect } from 'react';

export const FunnyMessagesToAvoidCruelReality = ({ strings, maxRuntime }: {
  strings: string[],
  maxRuntime: number
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [displayingString, setDisplayingString] = useState<string>(strings[currentIndex]);

  useEffect(() => {
    if (elapsedTime >= maxRuntime) {
      setDisplayingString("");
      return;
    }

    const displayNextString = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % strings.length);
      setDisplayingString(strings[currentIndex]);
      setElapsedTime((prevTime) => prevTime + delay);
    };

    // Generate a random delay between 1 and 3 seconds (1000 to 3000 milliseconds)
    const delay = Math.random() * (3000 - 1000) + 1000;
    const timeout = setTimeout(displayNextString, delay);

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timeout);
  }, [elapsedTime, maxRuntime, strings]);

  return (
    <>
      {displayingString}
    </>
  );
};