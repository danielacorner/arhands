import { Interactive, useHitTest, useXRFrame } from "@react-three/xr";
import { Box, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import { useGeolocation } from "react-use";
import { Icon } from "@mui/material";
import { LocationOff } from "@mui/icons-material";
import { useCubes } from "../store";
import { BOX_WIDTH } from "../utils/constants";

export function PlaceableBlock() {
  const ref = useRef<any>(null);
  useHitTest((hit) => {
    if (!ref.current) {
      return;
    }
    /* const nextPosition =  */ hit.decompose(
      ref.current.position,
      ref.current.rotation,
      ref.current.scale
    );
    // console.log("🌟🚨 ~ useHitTest ~ nextPosition", nextPosition);

    // move to nearest grid position after hit test
    // const newPosition = getNearestGridPosition(ref.current.position);
    // console.log("🌟🚨 ~ useHitTest ~ newPosition", newPosition);
    // ref.current.position = newPosition;
  });

  const [isHovered, setIsHovered] = useState(false);
  const [, setCubes] = useCubes();

  const handleSelect = () => {
    console.log("🚨 ~ HitTestExample ~ handleSelect");
    const newCube = { position: ref.current.position };
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

  //! ? reposition the block on interval according to camera position?

  return loading ? (
    <Html ref={ref}>
      <Icon>
        <LocationOff />
      </Icon>
    </Html>
  ) : (
    <>
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

function getNearestGridPosition(position) {
  const x = Math.round(position[0] / BOX_WIDTH) * BOX_WIDTH;
  const y = Math.round(position[1] / BOX_WIDTH) * BOX_WIDTH;
  const z = Math.round(position[2] / BOX_WIDTH) * BOX_WIDTH;
  return [x, y, z];
}
