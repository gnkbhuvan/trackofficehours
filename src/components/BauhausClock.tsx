import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BauhausClock = () => {
  const groupRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Mesh>(null);
  const minuteHandRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
      groupRef.current.rotation.z = 0;
    }

    return () => {
      // Cleanup
      if (groupRef.current) {
        groupRef.current.clear();
      }
    };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    groupRef.current.rotation.y += 0.005;
    
    if (hourHandRef.current && minuteHandRef.current) {
      const time = clock.getElapsedTime();
      hourHandRef.current.rotation.z = -(time * 0.1) % (Math.PI * 2);
      minuteHandRef.current.rotation.z = -(time * 0.5) % (Math.PI * 2);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <cylinderGeometry args={[2, 2, 0.2, 32]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        return (
          <mesh
            key={i}
            position={[
              Math.sin(angle) * 1.7,
              Math.cos(angle) * 1.7,
              0.2,
            ]}
          >
            <boxGeometry args={[0.2, 0.4, 0.1]} />
            <meshStandardMaterial color="#0000FF" />
          </mesh>
        );
      })}

      <mesh ref={hourHandRef} position={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 1.2, 0.1]} />
        <meshStandardMaterial color="#FF0000" />
      </mesh>

      <mesh ref={minuteHandRef} position={[0, 0, 0.4]}>
        <boxGeometry args={[0.1, 1.5, 0.1]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>
    </group>
  );
};

export default BauhausClock;