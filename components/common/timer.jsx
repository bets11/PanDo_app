import React, { useEffect } from 'react';

export default function Timer({ duration, onTimerEnd }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTimerEnd && onTimerEnd(); 
    }, duration);

    return () => clearTimeout(timer); 
  }, [duration, onTimerEnd]);

  return null; 
}
