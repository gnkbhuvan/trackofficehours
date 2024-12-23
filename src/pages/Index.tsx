import { useState } from 'react';
import { parseTimeLog, calculateRemainingTime } from '../utils/timeCalculator';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [timeLog, setTimeLog] = useState('');
  const [calculation, setCalculation] = useState<{
    remainingMinutes: number;
    status: 'incomplete' | 'overtime' | 'done';
    message: string;
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-900">
          Work Hours Calculator
        </h1>
        
        <div className="space-y-6">
          <Card className="time-card">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Enter Clock In/Out Times
            </h2>
            <Textarea
              value={timeLog}
              onChange={(e) => handleTimeLogChange(e.target.value)}
              placeholder="Enter times in format:&#10;10:18:37 AM&#10;1:39:14 PM&#10;2:18:42 PM&#10;MISSING"
              className="time-input"
            />
          </Card>

          {calculation && (
            <Card className="time-card animate-fade">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Calculation Result
              </h2>
              <p className={`result-text ${getStatusColor(calculation.status)}`}>
                {calculation.message}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;