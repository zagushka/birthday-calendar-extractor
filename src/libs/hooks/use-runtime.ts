import { useEffect, useState } from 'react';

const useRuntime = (isRunning: boolean) => {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [runtime, setRuntime] = useState<number>(0);

  useEffect(() => {
    if (isRunning) {
      // Record the start time when isRunning becomes true
      setStartTime(Date.now());
    } else if (startTime) {
      // Calculate runtime when isRunning becomes false
      const elapsedTime = Date.now() - startTime;
      setRuntime(elapsedTime);
      setStartTime(null);
    }
  }, [isRunning, startTime]);

  return runtime;
};

export default useRuntime;