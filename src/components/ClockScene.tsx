import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import BauhausClock from './BauhausClock';
import { useToast } from '@/components/ui/use-toast';

const ClockScene = () => {
  const { toast } = useToast();

  const handleError = (error: any) => {
    console.error('Three.js Error:', error);
    toast({
      title: "3D Rendering Error",
      description: "There was an error loading the clock. Please refresh the page.",
      variant: "destructive",
    });
  };

  return (
    <div className="h-[300px] w-full rounded-lg border-2 border-black bg-white">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="rounded-lg"
        onError={handleError}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <BauhausClock />
          <OrbitControls enableZoom={false} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ClockScene;