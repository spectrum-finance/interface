import { useEffect, useState } from 'react';

import styles from './CountdownTimer.module.less';

interface CountdownProps {
  targetDate: string;
}

export default function CountdownTimer(props: CountdownProps) {
  const { targetDate } = props;
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const targetTime = new Date(targetDate).getTime();
    const difference = targetTime - now;

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
      setTimeLeft(calculateTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (number: number) =>
    number < 10 ? `0${number}` : number;

  return (
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
  );
}
