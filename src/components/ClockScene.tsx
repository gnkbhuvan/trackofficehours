import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import BauhausClock from './BauhausClock';
import { useToast } from '@/components/ui/use-toast';

const ClockScene = () => {
  const { toast } = useToast();
  const [hasError, setHasError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleError = (error: any) => {
    console.error('Three.js Error:', error);
    setHasError(true);
    toast({
      title: "3D Rendering Error",
      description: "There was an error loading the clock. Please refresh the page.",
      variant: "destructive",
    });
  };

  if (!mounted) {
    return (
      <div className="h-[300px] w-full rounded-lg border-2 border-black bg-white flex items-center justify-center">
        <p>Loading 3D scene...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="h-[300px] w-full rounded-lg border-2 border-black bg-white flex items-center justify-center">
        <p className="text-red-500">Failed to load 3D clock. Please refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full rounded-lg border-2 border-black bg-white">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="rounded-lg"
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance"
        }}
        onError={handleError}
        onCreated={({ gl }) => {
          gl.setClearColor('#ffffff', 0);
        }}
      >
        <ErrorBoundary fallback={<FallbackContent />}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <BauhausClock />
            <OrbitControls enableZoom={false} />
          </Suspense>
        </ErrorBoundary>
      </Canvas>
    </div>
  );
};

// Simple error boundary component
const ErrorBoundary = ({ children, fallback }: { children: React.ReactNode; fallback: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) return <>{fallback}</>;
  return <>{children}</>;
};

const FallbackContent = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="red" />
  </mesh>
);

export default ClockScene;