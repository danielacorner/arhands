import {
  Interactive,
  // useHitTest,
  // useInteraction,
  // useXRFrame,
} from "@react-three/xr";
import { Box, Html } from "@react-three/drei";
import { useCallback, useState } from "react";
import { useGeolocation /* , useInterval */ } from "react-use";
import { Icon } from "@mui/material";
import { LocationOff } from "@mui/icons-material";
import { useCubes, useEmojiPickerPosition } from "../store";
import { BOX_WIDTH } from "../utils/constants";
import {
  getGeolocationFromPosition,
  getGeolocationInMeters,
} from "./METERS_PER_DEGREE_LATITUDE";
import isEqual from "lodash.isequal";
import { useMoveToNearestPlaceablePosition } from "./Cubes";
import { getNearestPlaceablePosition } from "./getNearestPlaceablePosition";

export function PlaceableBlock() {
  const ref = useMoveToNearestPlaceablePosition();
  // useHitTest((hit) => {
  //   if (!ref.current) {
  //     return;
  //   }
  //   /* const nextPosition =  */ hit.decompose(
  //     ref.current.position,
  //     ref.current.rotation,
  //     ref.current.scale
  //   );

  //   // move to nearest grid position after hit test
  //   // const newPosition = getNearestPlaceablePosition(ref.current.position);
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
  //   // const newPosition = getNearestPlaceablePosition(ref.current.position);

  //   // ref.current.position = newPosition;

  // });

  const [isHovered, setIsHovered] = useState(false);
  const [cubes, setCubes] = useCubes();
  const [emojiPickerPosition, setEmojiPickerPosition] =
    useEmojiPickerPosition();
  const {
    loading,
    // loading: false
    // heading: 241.7476043701172
    // altitude: 92.88787898420597
    // longitude: -76.010453
    // latitude: 44.8871892
    altitude,
    longitude,
    latitude,
  } = useGeolocation();
  const getPositionFromGeolocation = useGetPositionFromGeolocation();

  // get the user's position,
  // then derive each cube's position in the scene
  // from by the difference between the user's position and the cube's position
  const userPosition = getPositionFromGeolocation({
    altitude,
    latitude,
    longitude,
  });

  const handleSelect = () => {
    if (!ref.current || emojiPickerPosition) {
      return;
    }

    const newPosition = ref.current.position;
    const relativeGeolocation = getGeolocationFromPosition(newPosition);
    const newCubeGeolocation = {
      altitude: relativeGeolocation.altitude + altitude,
      latitude: relativeGeolocation.latitude + latitude,
      longitude: relativeGeolocation.longitude + longitude,
    };
    const newCube = {
      geolocation: newCubeGeolocation,
      positionInScene: getPositionFromGeolocation(newCubeGeolocation),
      emoji: "",
    };
    const alreadyExists = cubes.find((c) =>
      isEqual(newCube.positionInScene, c.positionInScene)
    );
    if (alreadyExists) {
      console.log(
        "🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🌟🚨 ~ handleSelect ~ alreadyExists",
        alreadyExists
      );
      // delete the cube?!?!?
      // setCubes((prevCubes) =>
      //   prevCubes.filter(
      //     (p) => !isEqual(p.positionInScene, newCube.positionInScene)
      //   )
      // );
      setEmojiPickerPosition((p) => (p ? null : newCube.positionInScene));
    } else {
      setCubes((prevCubes) => [...prevCubes, newCube]);
    }
  };

  // useInteraction(ref, "onSelect", () => console.log("selected!"));

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
          args={[BOX_WIDTH, BOX_WIDTH, BOX_WIDTH]}
          material-transparent={true}
          material-opacity={0.5}
          material-color={isHovered ? "#06ad30" : "#74c3d1"}
          {...({} as any)}
        />
      </Interactive>
    </>
  );
}

// store the block's geolocation in CubeType
// -> derive the threejs [x,y,z] position relative to the camera + heading

// in threejs ar [1,1,1] === [1 meter, 1 meter, 1 meter]

export function useGetPositionFromGeolocation() {
  // 1. get geolocation
  const { latitude, longitude, altitude, loading } = useGeolocation();
  // 2. get block geolocation
  return useCallback(
    (blockGeolocation: {
      latitude: number;
      longitude: number;
      altitude: number;
    }) => {
      if (!blockGeolocation || loading) {
        return;
      }
      // 3. get x,y,z distances between geolocations in meters
      // user geolocation
      const {
        x: userX,
        y: userY,
        z: userZ,
      } = getGeolocationInMeters({ latitude, longitude, altitude });

      // TODO: each block can't hold its own geolocation? (not accurate enough?)

      // block geolocation
      const {
        x: blockX,
        y: blockY,
        z: blockZ,
      } = getGeolocationInMeters({
        latitude: blockGeolocation.latitude,
        longitude: blockGeolocation.longitude,
        altitude: blockGeolocation.altitude,
      });

      // position in scene = block position - user position
      const [x, y, z] = [blockX - userX, blockY - userY, blockZ - userZ];
      const blockPositionInScene = getNearestPlaceablePosition([x, y, z]);
      console.log("🌟🚨 ~ useGetPositionFromGeolocation ~ [x, y, z]", [
        x,
        y,
        z,
      ]);
      console.log(
        "🌟🚨 ~ useGetPositionFromGeolocation ~ blockPositionInScene",
        blockPositionInScene
      );
      return blockPositionInScene;
    },
    [latitude, longitude, altitude, loading]
  );
}

export function useGetGeolocationFromPosition() {
  // 1. get geolocation
  const { latitude, longitude, altitude } = useGeolocation();
  // 2. get block geolocation
  return useCallback(
    (blockGeolocation: {
      latitude: number;
      longitude: number;
      altitude: number;
    }) => {
      if (!blockGeolocation) {
        return;
      }
      // 3. get x,y,z distances between geolocations in meters
      const {
        x: userX,
        y: userY,
        z: userZ,
      } = getGeolocationInMeters({ latitude, longitude, altitude });
      const {
        x: blockX,
        y: blockY,
        z: blockZ,
      } = getGeolocationInMeters({
        latitude: blockGeolocation.latitude,
        longitude: blockGeolocation.longitude,
        altitude: blockGeolocation.altitude,
      });

      const x = blockX - userX;
      console.log("🌟🚨 ~ useGetGeolocationFromPosition ~ userX", userX);
      console.log("🌟🚨 ~ useGetGeolocationFromPosition ~ blockX", blockX);
      const y = blockY - userY;
      const z = blockZ - userZ;
      const blockPositionInScene = getNearestPlaceablePosition([x, y, z]);
      console.log(
        "🌟🚨 ~ useGetGeolocationFromPosition ~ blockPositionInScene",
        blockPositionInScene
      );
      return blockPositionInScene;
    },
    [latitude, longitude, altitude]
  );
}
