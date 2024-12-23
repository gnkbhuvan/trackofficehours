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
        return 'text-[#8E9196]';
      case 'overtime':
        return 'text-[#FEC6A1]';
      case 'done':
        return 'text-[#F2FCE2]';
      default:
        return 'text-[#8E9196]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F0FB] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-[#222222] drop-shadow-sm">
            Work Hours Calculator
          </h1>
          <p className="text-[#555555]">Track your work hours and know exactly when to clock out</p>
        </div>
        
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-xl border-0 bg-[#F1F0FB] p-8 shadow-[20px_20px_60px_#cdccd5,-20px_-20px_60px_#ffffff] transition-all">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#8E9196]" />
              <h2 className="text-xl font-semibold text-[#222222]">
                Enter Clock In/Out Times
              </h2>
            </div>
            <Textarea
              value={timeLog}
              onChange={(e) => handleTimeLogChange(e.target.value)}
              placeholder="Enter times in format:&#10;10:18:37 AM&#10;1:39:14 PM&#10;2:18:42 PM&#10;MISSING"
              className="min-h-[200px] w-full rounded-lg border-0 bg-[#F1F0FB] p-6 font-mono text-sm shadow-[inset_8px_8px_16px_#cdccd5,inset_-8px_-8px_16px_#ffffff] focus:border-0 focus:ring-0"
            />
          </Card>

          {calculation && (
            <Card className="overflow-hidden rounded-xl border-0 bg-[#F1F0FB] p-8 shadow-[20px_20px_60px_#cdccd5,-20px_-20px_60px_#ffffff] transition-all">
              <h2 className="mb-4 text-xl font-semibold text-[#222222]">
                Calculation Result
              </h2>
              <div className="space-y-4">
                <p className={`rounded-lg bg-[#F1F0FB] p-6 text-lg font-medium shadow-[inset_8px_8px_16px_#cdccd5,inset_-8px_-8px_16px_#ffffff] ${getStatusColor(calculation.status)}`}>
                  {calculation.message}
                </p>
                {calculation.clockOutTime && (
                  <div className="mt-4 rounded-lg bg-[#F1F0FB] p-6 shadow-[8px_8px_16px_#cdccd5,-8px_-8px_16px_#ffffff]">
                    <span className="block text-lg font-semibold text-[#222222]">Recommended Clock Out Time:</span>
                    <span className="mt-2 block text-2xl font-bold text-[#8E9196]">
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