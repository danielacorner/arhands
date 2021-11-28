import * as THREE from "three";
import { useCallback, useRef, useState } from "react";
import { useGeolocation, useOrientation } from "react-use";
import { useCubes } from "../store";
import { BOX_WIDTH } from "../utils/constants";
import { useGetPositionFromGeolocation } from "./PlaceableBlock";
import { useEffectOnce } from "../hooks/useEffectOnce";
import { useXRFrame } from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import { rotatePoint } from "../hooks/rotatePoint";

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
      <BallTracksCameraAndCameraRotation />
    </>
  );
}

function BallTracksCamera() {
  const ref = useRef(null as any);
  const { camera } = useThree();
  useXRFrame((time, { session, trackedAnchors }) => {
    if (!ref.current) return;
    const newPosition = [
      camera.position.x,
      camera.position.y,
      camera.position.z - 1,
    ];
    // console.log("🌟🚨 ~ BallTracksCamera ~ camera", camera);
    // console.log("🌟🚨 ~ useXRFrame ~ newPosition", newPosition);
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
function BallTracksCameraAndCameraRotation() {
  const ref = useRef(null as any);
  const { camera } = useThree();
  useXRFrame((time, { session, trackedAnchors }) => {
    if (!ref.current) return;
    const [bx, by, bz] = [0, 0, -1.5];
    // const rotated = rotatePoint(
    //   newPosition,
    // THREE.MathUtils.radToDeg(camera.rotation.y)
    // );

    /** https://stackoverflow.com/a/17411276/11718078 */
    // rotate the ball position's x & z coords around the origin to face the camera
    const [x1, z1] = rotate2DPointAroundCenter(
      [bx, bz], // initial position: ;
      -camera.rotation.y // rotate by the camera's rotation around the vertical axis
      // THREE.MathUtils.radToDeg(camera.rotation.y)
    );
    const rotatedToForwardFacing = [x1, by, z1];
    // ! optional
    // const rotatedToMatchZAxis = rotatePointVerticallyAroundPoint(
    //   rotatedToForwardFacing,
    //   [camera.position.x, camera.position.y, camera.position.z],
    //   camera.rotation.x
    // );
    const translatedToCameraPosition = [
      rotatedToForwardFacing[0] + camera.position.x,
      rotatedToForwardFacing[1] + camera.position.y,
      rotatedToForwardFacing[2] + camera.position.z,
    ];

    ref.current.position.set(...translatedToCameraPosition);
  });

  return (
    <Sphere
      ref={ref}
      material-color="limegreen"
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

/** https://stackoverflow.com/a/17411276/11718078 */
function rotate2DPointAroundCenter(
  [x, y]: [number, number] | number[],
  /** angle in radians */
  angle: number
) {
  const [x0, y0] = [0, 0];
  const [x1, y1] = [x, y];
  const [x2, y2] = [
    x0 + Math.cos(angle) * (x1 - x0) - Math.sin(angle) * (y1 - y0),
    y0 + Math.sin(angle) * (x1 - x0) + Math.cos(angle) * (y1 - y0),
  ];
  return [x2, y2];
}
