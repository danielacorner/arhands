import { useControls } from "leva";
import * as THREE from "three";
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useSphere } from "@react-three/cannon";
import { useWindowSize } from "react-use";
import { Axe } from "./Axe";
import { speed, rotation } from "./utils";
// import { usePlayerControls } from "./usePlayerControls";

export function Player(props) {
  const axe = useRef<any>();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 10, 0],
    ...props,
  }));
  // const { forward, backward, left, right, jump } = usePlayerControls();
  const { camera } = useThree();
  const velocity = useRef([0, 0, 0]);
  useEffect(
    () => api.velocity.subscribe((v) => (velocity.current = v)),
    [api.velocity]
  );

  useFrame((state) => {
    speed.fromArray(velocity.current);

    axe.current.children[0].rotation.x = THREE.MathUtils.lerp(
      axe.current.children[0].rotation.x,
      Math.sin(((speed.length() > 1) as any) * state.clock.elapsedTime * 10) /
        6,
      0.1
    );
    axe.current.rotation.copy(camera.rotation);
    axe.current.position
      .copy(camera.position)
      .add(camera.getWorldDirection(rotation).multiplyScalar(1));
  });

  const { width } = useWindowSize();
  const axx = width / 1000;
  const { ax, ay, az } = useControls({ ax: 2.54 * axx, ay: -1.35, az: -2.45 });

  return (
    <>
      <mesh ref={ref} />
      <group
        ref={axe}
        onPointerMissed={(e) => (axe.current.children[0].rotation.x = -0.5)}
      >
        <Axe position={[ax, ay, az]} />
      </group>
    </>
  );
}
