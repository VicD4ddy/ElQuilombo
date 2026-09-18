'use client';

import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date('2026-10-03T21:00:00').getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, []);

  const format2Digits = (num: number) => (num < 10 ? `0${num}` : `${num}`);

  return (
    <div className="countdown-widget" aria-label="Cuenta regresiva para El Quilombo">
      <div className="countdown-header">
        <span className="live-dot" />
        <span className="countdown-title">INICIO DEL EVENTO • 3 DE OCTUBRE, 9:00 PM</span>
      </div>
      <div className="countdown-grid">
        <div className="countdown-unit">
          <span className="number" id="cd-days">
            {isClient ? format2Digits(timeLeft.days) : '16'}
          </span>
          <span className="label">DÍAS</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="number" id="cd-hours">
            {isClient ? format2Digits(timeLeft.hours) : '04'}
          </span>
          <span className="label">HORAS</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="number" id="cd-minutes">
            {isClient ? format2Digits(timeLeft.minutes) : '32'}
          </span>
          <span className="label">MIN</span>
        </div>
        <div className="countdown-separator">:</div>
        <div className="countdown-unit">
          <span className="number" id="cd-seconds">
            {isClient ? format2Digits(timeLeft.seconds) : '10'}
          </span>
          <span className="label">SEG</span>
        </div>
      </div>
    </div>
  );
}
