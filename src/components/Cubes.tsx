import { useCallback, useRef, useState } from "react";
// import { useBox } from "@react-three/cannon";
import { useCubes } from "../store";
import { BOX_WIDTH } from "../utils/constants";

export function Cube({ position }) {
  const [, setCubes] = useCubes();
  const addCube = useCallback(
    (newCube) => {
      setCubes((prev) => [...prev, newCube]);
    },
    [setCubes]
  );
  const ref = useRef<any>(null);
  // const [ref] = useBox(() => ({ type: "Static", ...props }));
  const [hover, set] = useState<any>(null);
  // const texture = useLoader(THREE.TextureLoader, dirt);
  const onMove = useCallback((e) => {
    e.stopPropagation();
    set(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => set(null), []);
  const onClick = useCallback(
    (e) => {
      console.log("🌟🚨 ~ Cube ~ e", e);
      if (!ref.current) {
        return;
      }
      e.stopPropagation();
      const { x, y, z } = ref.current.position;
      const dir = [[x + 1, y, z], [x - 1, y, z], [x, y + 1, z], [x, y - 1, z], [x, y, z + 1], [x, y, z - 1]]; // prettier-ignore
      const newCube = { position: dir[Math.floor(e.faceIndex / 2)] as any };
      addCube(newCube);
    },
    [addCube, ref]
  );
  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      onPointerMove={onMove}
      onPointerOut={onOut}
      onClick={onClick}
      position={position}
    >
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          attachArray="material"
          key={index}
          // map={texture}
          color={hover === index ? "hotpink" : "white"}
        />
      ))}
      <boxBufferGeometry args={[BOX_WIDTH, BOX_WIDTH, BOX_WIDTH]} />
    </mesh>
  );
}
export function Cubes() {
  const [cubes] = useCubes();

  return (
    <>
      {cubes.map(({ position }, index) => (
        <Cube key={index} position={position} />
      ))}
    </>
  );
}