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
        return 'text-blue-600';
      case 'overtime':
        return 'text-orange-600';
      case 'done':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-gray-800">
            Work Hours Calculator
          </h1>
          <p className="text-gray-600">Track your work hours and know exactly when to clock out</p>
        </div>
        
        <div className="space-y-6">
          <Card className="overflow-hidden rounded-xl border-0 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Clock In/Out Times
              </h2>
            </div>
            <Textarea
              value={timeLog}
              onChange={(e) => handleTimeLogChange(e.target.value)}
              placeholder="Enter times in format:&#10;10:18:37 AM&#10;1:39:14 PM&#10;2:18:42 PM&#10;MISSING"
              className="min-h-[200px] w-full rounded-lg border border-gray-200 bg-white/50 p-4 font-mono text-sm shadow-inner focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
            />
          </Card>

          {calculation && (
            <Card className="overflow-hidden rounded-xl border-0 bg-white/80 p-6 shadow-xl backdrop-blur-sm transition-all hover:shadow-2xl">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Calculation Result
              </h2>
              <div className="space-y-3">
                <p className={`text-lg font-medium ${getStatusColor(calculation.status)}`}>
                  {calculation.message}
                </p>
                {calculation.clockOutTime && (
                  <p className="mt-2 rounded-lg bg-blue-50 p-3 text-blue-700">
                    <span className="font-semibold">Recommended Clock Out Time:</span>{' '}
                    {calculation.clockOutTime}
                  </p>
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