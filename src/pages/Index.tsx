import { useState } from 'react';
import { parseTimeLog, calculateRemainingTime } from '../utils/timeCalculator';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Clock } from 'lucide-react';

const Index = () => {
  const [timeLog, setTimeLog] = useState('');
  const [calculation, setCalculation] = useState<{
    remainingMinutes: number;
    status: 'incomplete' | 'overtime' | 'done';
    message: string;
    clockOutTime?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleTimeLogChange = (value: string) => {
    setTimeLog(value);
    try {
      const times = parseTimeLog(value);
      const result = calculateRemainingTime(times);
      setCalculation(result);
    } catch (error) {
      console.error('Error parsing time log:', error);
      toast({
        title: "Invalid Time Format",
        description: "Please enter times in the format 'HH:MM:SS AM/PM'",
        variant: "destructive",
      });
      setCalculation(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'incomplete':
        return 'text-black';
      case 'overtime':
        return 'text-[#FF0000]';
      case 'done':
        return 'text-[#0000FF]';
      default:
        return 'text-black';
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12 text-center">
          <div className="bauhaus-pattern">
            <h1 className="mb-4 text-5xl font-bold text-black">
              Work Hours Calculator
            </h1>
            <p className="text-[#333333] font-['Inter'] text-xl">
              Track your work hours and know exactly when to clock out
            </p>
          </div>
        </div>
        
        <div className="space-y-8">
          <Card className="time-card">
            <div className="mb-6 flex items-center gap-3">
              <Clock className="h-6 w-6 text-black" />
              <h2 className="text-2xl font-semibold text-black">
                Enter Clock In/Out Times
              </h2>
            </div>
            <Textarea
              value={timeLog}
              onChange={(e) => handleTimeLogChange(e.target.value)}
              placeholder="Enter times in format:&#10;10:18:37 AM&#10;1:39:14 PM&#10;2:18:42 PM&#10;MISSING"
              className="time-input"
            />
          </Card>

          {calculation && (
            <Card className="time-card">
              <h2 className="mb-6 text-2xl font-semibold text-black">
                Calculation Result
              </h2>
              <div className="space-y-6">
                <p className={`border-2 border-black bg-white p-6 font-['Inter'] text-xl ${getStatusColor(calculation.status)}`}>
                  {calculation.message}
                </p>
                {calculation.clockOutTime && (
                  <div className="border-2 border-black bg-white p-6">
                    <span className="block text-xl font-semibold text-black">Recommended Clock Out Time:</span>
                    <span className="mt-2 block text-3xl font-bold text-[#0000FF]">
                      {calculation.clockOutTime}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;