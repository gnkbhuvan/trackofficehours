import { format, parse, differenceInMinutes } from 'date-fns';

export const parseTimeLog = (timeLog: string): Date[] => {
  const times = timeLog
    .trim()
    .split('\n')
    .filter(time => time && time !== 'MISSING');

  return times.map(time => {
    const today = new Date();
    const parsedTime = parse(time.trim(), 'h:mm:ss a', today);
    return parsedTime;
  });
};

export const calculateRemainingTime = (times: Date[]): {
  remainingMinutes: number;
  status: 'incomplete' | 'overtime' | 'done';
  message: string;
} => {
  console.log('Calculating remaining time for:', times);
  
  if (times.length < 2) {
    return {
      remainingMinutes: 8 * 60,
      status: 'incomplete',
      message: 'Need at least one clock-in and clock-out time'
    };
  }

  let totalMinutes = 0;
  
  for (let i = 0; i < times.length - 1; i += 2) {
    const clockIn = times[i];
    const clockOut = times[i + 1];
    
    if (clockOut) {
      const diff = differenceInMinutes(clockOut, clockIn);
      totalMinutes += diff;
      console.log(`Session ${i/2 + 1}: ${diff} minutes`);
    }
  }

  const remainingMinutes = 8 * 60 - totalMinutes;
  console.log('Total minutes worked:', totalMinutes);
  console.log('Remaining minutes:', remainingMinutes);

  if (remainingMinutes > 0) {
    return {
      remainingMinutes,
      status: 'incomplete',
      message: `You need to work ${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m more`
    };
  } else if (remainingMinutes === 0) {
    return {
      remainingMinutes: 0,
      status: 'done',
      message: 'You have completed your 8 hours!'
    };
  } else {
    return {
      remainingMinutes: Math.abs(remainingMinutes),
      status: 'overtime',
      message: `You are in overtime by ${Math.floor(Math.abs(remainingMinutes) / 60)}h ${Math.abs(remainingMinutes) % 60}m`
    };
  }
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm:ss a');
};