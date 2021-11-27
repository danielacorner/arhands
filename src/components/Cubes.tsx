import { useCallback, useRef, useState } from "react";
import { useGeolocation } from "react-use";
import { useCubes } from "../store";
import { BOX_WIDTH } from "../utils/constants";
import { useGetPositionFromGeolocation } from "./PlaceableBlock";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useXRFrame } from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

export function Cube({ position, materialProps = {} }) {
  const [, setCubes] = useCubes();

  const ref = useRef<any>(null);
  // const [ref] = useBox(() => ({ type: "Static", ...props }));
  const [hover, set] = useState<any>(null);
  // const texture = useLoader(THREE.TextureLoader, dirt);
  const onMove = useCallback((e) => {
    e.stopPropagation();
    set(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => set(null), []);
  const { altitude, latitude, longitude } = useGeolocation();
  const onClick = useCallback(
    (e) => {
      console.log("🌟🚨 ~ Cube ~ e", e);
      if (!ref.current) {
        return;
      }
      e.stopPropagation();
      const { x, y, z } = ref.current.position;
      const dir = [[x + 1, y, z], [x - 1, y, z], [x, y + 1, z], [x, y - 1, z], [x, y, z + 1], [x, y, z - 1]]; // prettier-ignore
      const newCube = {
        position: dir[Math.floor(e.faceIndex / 2)] as any,
        geolocation: { altitude, latitude, longitude },
      };
      setCubes((prev) => [...prev, newCube]);
    },
    [setCubes, altitude, latitude, longitude, ref]
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
          {...materialProps}
          // color={hover === index ? "hotpink" : "white"}
        />
      ))}
      <boxBufferGeometry args={[BOX_WIDTH, BOX_WIDTH, BOX_WIDTH]} />
    </mesh>
  );
}
export function Cubes() {
  const [cubes] = useCubes();
  console.log("🟩🚨 ~ Cubes ~ cubes", cubes);

  useRecalculateCubePositionsWhenWeGetGeolocation();

  return (
    <>
      {cubes
        .filter((c) => c.position)
        .map(({ position }, index) => (
          <Cube key={index} position={position} />
        ))}
      {/* reference cubes */}
      <Cube
        position={[0, 0, -1]}
        materialProps={{
          color: "cornflowerblue",
          transparent: true,
          opacity: 0.5,
        }}
      />
      <Cube
        position={[0, 0, 0]}
        materialProps={{ color: "steelblue", transparent: true, opacity: 0.5 }}
      />
      <Cube
        position={[0, 1, 0]}
        materialProps={{ color: "steelblue", transparent: true, opacity: 0.5 }}
      />
      <Cube
        position={[0, 0, 2]}
        materialProps={{ color: "limegreen", transparent: true, opacity: 0.5 }}
      />
      <Cube
        position={[0, 0, 5]}
        materialProps={{ color: "tomato", transparent: true, opacity: 0.5 }}
      />
      <BallTracksCamera />
    </>
  );
}

function BallTracksCamera() {
  const ref = useRef(null as any);
  const { camera } = useThree();
  useXRFrame((time, { session, trackedAnchors }) => {
    if (!ref.current) return;
    console.log("🌟🚨 ~ BallTracksCamera ~ camera", camera);
    const newPosition = [
      camera.position.x,
      camera.position.y,
      camera.position.z - 1,
    ];
    console.log("🌟🚨 ~ useXRFrame ~ newPosition", newPosition);
    ref.current.position.set(...newPosition);
  });

  return (
    <Sphere
      ref={ref}
      material-color="cornflowerblue"
      material-transparent={true}
      material-opacity={0.3}
      args={[BOX_WIDTH / 2]}
    />
  );
}

function useRecalculateCubePositionsWhenWeGetGeolocation() {
  const [cubes, setCubes] = useCubes();

  // when we get the geolocation,
  // re-derive any stored cube positions in the scene
  const { heading } = useGeolocation();
  const getPositionFromGeolocation = useGetPositionFromGeolocation();
  useEffectOnce({
    callback: () => {
      setCubes((prevCubes) =>
        prevCubes.map((cube) => {
          const position = getPositionFromGeolocation(cube.geolocation);
          console.log("🌟🚨 ~ prevCubes.map ~ position", position);
          return {
            ...cube,
            position,
          };
        })
      );
    },
    shouldRun: Boolean(heading) && cubes.length > 0,
    dependencies: [heading, cubes],
  });
}
