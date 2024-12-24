import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import BauhausClock from './BauhausClock';

const ClockScene = () => {
  return (
    <div className="h-[300px] w-full rounded-lg border-2 border-black bg-white">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        className="rounded-lg"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <BauhausClock />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default ClockScene;