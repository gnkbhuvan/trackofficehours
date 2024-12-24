import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, Box } from '@react-three/drei';
import * as THREE from 'three';

const BauhausClock = () => {
  const clockRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (clockRef.current) {
      clockRef.current.rotation.y += 0.005;
    }
    
    if (hourHandRef.current && minuteHandRef.current) {
      const time = clock.getElapsedTime();
      hourHandRef.current.rotation.z = -(time * 0.1) % (Math.PI * 2);
      minuteHandRef.current.rotation.z = -(time * 0.5) % (Math.PI * 2);
    }
  });

  return (
    <group ref={clockRef}>
      {/* Clock face */}
      <Cylinder args={[2, 2, 0.2, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>

      {/* Hour markers */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          args={[0.2, 0.4, 0.1]}
          position={[
            Math.sin((i * Math.PI) / 6) * 1.7,
            Math.cos((i * Math.PI) / 6) * 1.7,
            0.2,
          ]}
        >
          <meshStandardMaterial color="#0000FF" />
        </Box>
      ))}

      {/* Hour hand */}
      <mesh ref={hourHandRef} position={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>

      {/* Minute hand */}
      <mesh ref={minuteHandRef} position={[0, 0, 0.4]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
    </group>
  );
};

export default BauhausClock;