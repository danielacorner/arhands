import { useCallback, useRef, useState } from "react";
import { useCubes } from "../store";
import { BOX_WIDTH } from "../utils/constants";
import { useXRFrame } from "@react-three/xr";
import { useThree } from "@react-three/fiber";
import {
  Billboard,
  Html,
  Octahedron,
  Tetrahedron,
  Text,
} from "@react-three/drei";
import { useRecalculateCubePositionsWhenWeGetGeolocation } from "../hooks/useRecalculateCubePositionsWhenWeGetGeolocation";

export function Cubes() {
  const [cubes] = useCubes();
  console.log("🟩🚨 ~ Cubes ~ cubes", cubes);

  useRecalculateCubePositionsWhenWeGetGeolocation();

  return (
    <>
      {cubes
        .filter((c) => c.positionInScene)
        .map(({ positionInScene, emoji }, index) => (
          <Cube key={index} position={positionInScene} emoji={emoji} />
        ))}
      {/* reference cubes */}
      <Cube
        position={[0, 0, 0]}
        materialProps={{
          color: "slategrey",
          transparent: true,
          opacity: 0.4,
        }}
      />
      <BallTracksCamera />
      <BallTracksCameraAndCameraRotation />
      {/* <BallTracksCameraAndCameraRotationsNearestPlaceablePosition /> */}
    </>
  );
}

export function Cube({ position, emoji = "", materialProps = {} }) {
  const ref = useRef<any>(null);
  // const [ref] = useBox(() => ({ type: "Static", ...props }));
  const [hover, set] = useState<any>(null);
  // const texture = useLoader(THREE.TextureLoader, dirt);
  const onMove = useCallback((e) => {
    e.stopPropagation();
    set(Math.floor(e.faceIndex / 2));
  }, []);
  const onOut = useCallback(() => set(null), []);

  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      onPointerMove={onMove}
      onPointerOut={onOut}
      // onClick={onClick}
      position={position}
    >
      {emoji ? (
        <>
          <Billboard>
            <Html transform={true} scale={0.4}>
              {emoji}
            </Html>
          </Billboard>
          <meshStandardMaterial
            transparent={true}
            opacity={0.5}
            color={"#5ab8e4"}
          />
          <sphereBufferGeometry args={[BOX_WIDTH / 2]} />
        </>
      ) : (
        <>
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
        </>
      )}
    </mesh>
  );
}

function BallTracksCamera() {
  const ref = useRef(null as any);
  const { camera } = useThree();
  useXRFrame(() => {
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
    <Tetrahedron
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
  useXRFrame(() => {
    if (!ref.current) return;
    const [bx, by, bz] = [0, 0, -1.5];
    /** https://stackoverflow.com/a/17411276/11718078 */
    // rotate the ball position's x & z coords around the origin to face the camera
    const [x1, z1] = rotate2DPointAroundCenter([bx, bz], -camera.rotation.y);
    const [rx, ry, rz] = [x1, by, z1];

    // * optional
    // then we can also track the vertical rotation (around x axis)
    // rotate the ball position's y (& z) coords around the origin to face the camera
    const [y2, z2] = rotate2DPointAroundCenter([ry, rz], camera.rotation.x);

    // finally, translate the ball position to the camera position
    const translatedToCameraPosition = [
      rx + camera.position.x,
      y2 + camera.position.y,
      z2 + camera.position.z,
    ];

    ref.current.position.set(...translatedToCameraPosition);
  });

  return (
    <Octahedron
      ref={ref}
      material-color="limegreen"
      material-transparent={true}
      material-opacity={0.3}
      args={[BOX_WIDTH / 2]}
    />
  );
}
// function BallTracksCameraAndCameraRotationsNearestPlaceablePosition() {
//   const ref = useMoveToNearestPlaceablePosition();

//   return (
//     <Icosahedron
//       ref={ref}
//       material-color="tomato"
//       material-transparent={true}
//       material-opacity={0.3}
//       args={[BOX_WIDTH / 2]}
//     />
//   );
// }

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

export function useMoveToNearestPlaceablePosition() {
  const ref = useRef(null as any);
  const { camera } = useThree();
  useXRFrame(() => {
    if (!ref.current) return;
    const [bx, by, bz] = [0, 0, -1.5];
    /** https://stackoverflow.com/a/17411276/11718078 */
    // rotate the ball position's x & z coords around the origin to face the camera
    const [x1, z1] = rotate2DPointAroundCenter([bx, bz], -camera.rotation.y);
    const [rx, ry, rz] = [x1, by, z1];

    // * optional
    // then we can also track the vertical rotation (around x axis)
    // rotate the ball position's y (& z) coords around the origin to face the camera
    const [y2, z2] = rotate2DPointAroundCenter([ry, rz], camera.rotation.x);

    // finally, translate the ball position to the camera position
    const translatedToCameraPosition = [
      rx + camera.position.x,
      y2 + camera.position.y,
      z2 + camera.position.z,
    ];

    const translatedToNearestPlaceablePosition = [
      Math.round(translatedToCameraPosition[0] / BOX_WIDTH) * BOX_WIDTH,
      Math.round(translatedToCameraPosition[1] / BOX_WIDTH) * BOX_WIDTH,
      Math.round(translatedToCameraPosition[2] / BOX_WIDTH) * BOX_WIDTH,
    ];

    ref.current.position.set(...translatedToNearestPlaceablePosition);

    // const didPositionChange = !isEqual(
    //   selectedPosition,
    //   translatedToNearestPlaceablePosition
    // );
    // if (didPositionChange) {
    //   setSelectedPosition(translatedToNearestPlaceablePosition);
    // }
  });
  return ref;
}
