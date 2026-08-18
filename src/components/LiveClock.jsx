import { useEffect, useState } from 'react';

const formatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Berlin',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export default function LiveClock({ className = '', tz }) {
  const [time, setTime] = useState(() => formatter.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(formatter.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={`live-clock ${className}`}>
      <span className="live-clock__dot" aria-hidden="true" />
      {time} <span className="live-clock__tz">{tz}</span>
    </span>
  );
}
