import { useEffect, useState } from 'react';

import styles from './CountdownTimer.module.less';

interface CountdownProps {
  startTime: number;
  endTime: number;
}

export default function CountdownTimer({ startTime, endTime }: CountdownProps) {
  const startTimeInMilliseconds = startTime * 1000;
  const endTimeMiliseconds = endTime * 1000;
  const calculateTimeLeft = () => {
    const now = new Date().getTime();

    if (now < startTimeInMilliseconds) {
      return null; // Do not start countdown yet
    }

    const difference = endTimeMiliseconds - now;

    if (difference < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      if (newTimeLeft) {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const formatNumber = (number: number) =>
    number < 10 ? `0${number}` : number;

  return timeLeft ? (
    <div className={styles.timerContainer}>
      <div className={styles.time}>
        <p className={styles.value}>{formatNumber(timeLeft.days)}</p>
        <p className={styles.text}>Days</p>
      </div>
      <p className={styles.points}>:</p>
      <div className={styles.time}>
        <p className={styles.value}>{formatNumber(timeLeft.hours)}</p>
        <p className={styles.text}>Hours</p>
      </div>
      <p className={styles.points}>:</p>
      <div className={styles.time}>
        <p className={styles.value}>{formatNumber(timeLeft.minutes)}</p>
        <p className={styles.text}>Minutes</p>
      </div>
      <p className={styles.points}>:</p>
      <div className={styles.time}>
        <p className={styles.value}>{formatNumber(timeLeft.seconds)}</p>
        <p className={styles.text}>Seconds</p>
      </div>
    </div>
  ) : (
    <div className={styles.timerContainer}>
      <div className={styles.time}>
        <p className={styles.text} style={{ textAlign: 'center' }}>
          The Liquidity Bootstrapping Event (LBE) is Scheduled to Commence at
          1:00 PM UTC on November 23, 2023.
        </p>
      </div>
    </div>
  );
}
