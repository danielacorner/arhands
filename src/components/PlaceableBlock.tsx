import {
  Interactive,
  useHitTest,
  useInteraction,
  useXRFrame,
} from "@react-three/xr";
import { Box, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useGeolocation, useInterval } from "react-use";
import { Icon } from "@mui/material";
import { LocationOff } from "@mui/icons-material";
import { useCubes } from "../store";
import { BOX_WIDTH } from "../utils/constants";
import { useThree } from "@react-three/fiber";

export function PlaceableBlock() {
  const ref = useRef<any>(null);

  // useHitTest((hit) => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   /* const nextPosition =  */ hit.decompose(
  //     ref.current.position,
  //     ref.current.rotation,
  //     ref.current.scale
  //   );
  //   // console.log("🌟🚨 ~ useHitTest ~ nextPosition", nextPosition);

  //   // move to nearest grid position after hit test
  //   // const newPosition = getNearestGridPosition(ref.current.position);
  //   // console.log("🌟🚨 ~ useHitTest ~ newPosition", newPosition);
  //   // ref.current.position = newPosition;
  // });

  // https://github.com/pmndrs/react-xr/issues/40#issuecomment-803566109
  //   useHitTest hook will call the callback function once it detects a real surface. It will pass two arguments: a matrix and XRHitTestResult

  // Let's look at the simplest example

  // function HitTestExample() {
  //   const ref = useResource()

  //   useHitTest((hit) => {
  //     hit.decompose(ref.current.position, ref.current.rotation, ref.current.scale)
  //   })

  //   return <Box ref={ref} args={[0.1, 0.1, 0.1]} />
  // }
  // in this example we want to place a box on a real surface every frame

  // useHitTest((hit) => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   // Here hit is a Matrix4 object which contains position and rotation of a position on a real surface.

  //   // Next, we can copy position of the hit to the our Box mesh
  //   hit.decompose(
  //     ref.current.position,
  //     ref.current.rotation,
  //     ref.current.scale
  //   );

  //   // the effect of this is that as soon as there's a real plane detected, on every frame the Box will be placed on that plane

  //   // Here is the working example on codesandbox: https://codesandbox.io/s/react-xr-usehittest-demo-5iff9?file=/src/App.tsx

  //   // ...
  //   // ...finally, we can find the nearest position in our grid
  //   // const newPosition = getNearestGridPosition(ref.current.position);

  //   // ref.current.position = newPosition;

  //   console.log(
  //     "🌟🚨 ~ useHitTest ~ ref.current.rotation",
  //     ref.current.rotation
  //   );
  // });

  const { camera } = useThree();
  useXRFrame((time: number, xrFrame) => {
    console.log("🌟🚨 ~ useXRFrame ~ xrFrame", xrFrame);
    // const seconds = time / 1000;
    // const go = () % 1 === 0;
    console.log("🌟🚨 ~ useXRtime ~ time", time);
    if (!ref.current) {
      return;
    }
    const newPosition = [
      camera.position.x,
      camera.position.y,
      camera.position.z - 2,
    ];
    console.log("🌟🚨 ~ useXRFrame ~ newPosition", newPosition);
    ref.current.position.set(newPosition);
  });

  // useInterval(() => {
  //   if (!ref.current) {
  //     return;
  //   }

  //   const newPosition = getNearestGridPosition([
  //     camera.position.x - 0.1,
  //     camera.position.y + 0.1,
  //     camera.position.z + 1,
  //   ]);
  //   ref.current.position.set(newPosition);
  //   console.log("🌟🚨 ~ useXRFrame ~ newPosition", newPosition);
  // }, 1000);

  const [isHovered, setIsHovered] = useState(false);
  const [cubes, setCubes] = useCubes();

  const handleSelect = () => {
    if (!ref.current) {
      return;
    }
    console.log("🚨 ~ HitTestExample ~ handleSelect");
    const newPosition = getNearestGridPosition(ref.current.position);
    console.log("🌟🚨 ~ handleSelect ~ newPosition", newPosition);
    const newCube = { position: newPosition };
    const alreadyExists =
      Array.from(new Set([...cubes, newCube])).length === cubes.length;

    if (alreadyExists) {
      console.log("🌟🚨 ~ handleSelect ~ alreadyExists", alreadyExists);
      return;
    }
    setCubes((prevCubes) => [...prevCubes, newCube]);
  };

  const {
    altitude,
    latitude,
    longitude,
    loading,
    heading,
    // altitude: 92.88787898420597
    // heading: 241.7476043701172
    // latitude: 44.8871892
    // loading: false
    // longitude: -76.010453
  } = useGeolocation();
  console.log("🌟🚨 ~ PlaceableBlock ~ loading", loading);
  // useXRFrame((time, xrFrame) => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   const newRotation = THREE.MathUtils.degToRad(heading);
  //   console.log("🌟🚨 ~ useXRFrame ~ newRotation", newRotation);
  //   ref.current.rotation = newRotation;
  // });

  // useFrame(() => {
  //   ref.current.rotation = heading;
  // });

  useInteraction(ref, "onSelect", () => console.log("selected!"));

  return (
    <>
      {loading ? (
        <Html>
          <Icon>
            <LocationOff />
          </Icon>
        </Html>
      ) : null}
      <Interactive
        onHover={() => {
          setIsHovered(true);
          console.log("🚨 ~ HitTestExample ~ onHover");
        }}
        onBlur={() => {
          setIsHovered(false);
          console.log("🚨 ~ HitTestExample ~ onBlur");
        }}
        onSelect={handleSelect}
        onSelectEnd={() => console.log("🚨 ~ HitTestExample ~ onSelectEnd")}
        onSelectStart={() => console.log("🚨 ~ HitTestExample ~ onSelectStart")}
        onSqueeze={() => console.log("🚨 ~ HitTestExample ~ onSqueeze")}
        onSqueezeEnd={() => console.log("🚨 ~ HitTestExample ~ onSqueezeEnd")}
        onSqueezeStart={() =>
          console.log("🚨 ~ HitTestExample ~ onSqueezeStart")
        }
      >
        <Box
          ref={ref}
          // position={[0, 0, 0]}
          args={[BOX_WIDTH, BOX_WIDTH, BOX_WIDTH]}
          material-transparent={true}
          material-opacity={0.5}
          material-color={isHovered ? "#06ad30" : "#ad0606"}
          {...({} as any)}
        />
      </Interactive>
    </>
  );
}

function getNearestGridPosition([a, b, c]) {
  const x = Math.round(a / BOX_WIDTH) * BOX_WIDTH;
  const y = Math.round(b / BOX_WIDTH) * BOX_WIDTH;
  const z = Math.round(c / BOX_WIDTH) * BOX_WIDTH;
  return [x, y, z];
}
