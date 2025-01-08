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
  
  // Get current time in IST
  const currentDate = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const currentTimeIST = new Date(currentDate.getTime() + istOffset);
  
  if (times.length < 2) {
    const workMinutesNeeded = 8 * 60;
    const clockOutTime = format(addMinutes(currentTimeIST, workMinutesNeeded), 'h:mm:ss a');
    
    return {
      remainingMinutes: workMinutesNeeded,
      status: 'incomplete',
      message: 'Need at least one clock-in and clock-out time',
      clockOutTime
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

  let clockOutTime = null;
  if (remainingMinutes > 0) {
    clockOutTime = format(addMinutes(currentTimeIST, remainingMinutes), 'h:mm:ss a');
  }

  if (remainingMinutes > 0) {
    return {
      remainingMinutes,
      status: 'incomplete',
      message: `You need to work ${Math.floor(remainingMinutes / 60)}h ${remainingMinutes % 60}m more`,
      clockOutTime
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