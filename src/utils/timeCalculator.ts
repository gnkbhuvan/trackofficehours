import { format, parse, differenceInMinutes, addMinutes } from 'date-fns';

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
  clockOutTime?: string;
} => {
  console.log('Calculating remaining time for:', times);
  
  const now = new Date();
  
  if (times.length < 2) {
    const lastTime = times[0] || now;
    const workMinutesNeeded = 8 * 60;
    const clockOutTime = format(addMinutes(lastTime, workMinutesNeeded), 'h:mm:ss a');
    
    return {
      remainingMinutes: 8 * 60,
      status: 'incomplete',
      message: 'Need at least one clock-in and clock-out time',
      clockOutTime: clockOutTime
    };
  }

  let totalMinutes = 0;
  let lastClockIn = times[times.length - 1];
  
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

  let clockOutTime = null;
  if (lastClockIn && remainingMinutes > 0) {
    const suggestedClockOut = addMinutes(lastClockIn, remainingMinutes);
    const currentTime = new Date();
    
    // If suggested clock out is earlier than current time, calculate from current time
    if (suggestedClockOut < currentTime) {
      clockOutTime = format(addMinutes(currentTime, remainingMinutes), 'h:mm:ss a');
      console.log('Calculating from current time:', clockOutTime);
    } else {
      clockOutTime = format(suggestedClockOut, 'h:mm:ss a');
      console.log('Using suggested clock out time:', clockOutTime);
    }
  }

  if (remainingMinutes > 0) {
    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;
    const fromNow = format(addMinutes(now, remainingMinutes), 'h:mm:ss a');
    return {
      remainingMinutes,
      status: 'incomplete',
      message: `You need to work ${hours}h ${minutes}m more (until ${fromNow})`,
      clockOutTime
    };
  } else if (remainingMinutes === 0) {
    return {
      remainingMinutes: 0,
      status: 'done',
      message: 'You have completed your 8 hours!'
    };
  } else {
    const overtimeMinutes = Math.abs(remainingMinutes);
    const hours = Math.floor(overtimeMinutes / 60);
    const minutes = overtimeMinutes % 60;
    return {
      remainingMinutes: Math.abs(remainingMinutes),
      status: 'overtime',
      message: `You are in overtime by ${hours}h ${minutes}m`
    };
  }
};

export const formatTime = (date: Date): string => {
  return format(date, 'h:mm:ss a');
};