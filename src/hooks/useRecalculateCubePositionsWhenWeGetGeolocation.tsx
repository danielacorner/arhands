import { useGeolocation } from "react-use";
import { useCubes, useInitialGeolocation, useInitialPosition } from "../store";
import { useGetPositionFromGeolocation } from "../components/PlaceableBlock";
import { useEffectOnce } from "./useEffectOnce";

/** when we get the geolocation,
 * re-derive any stored cube positions in the scene from their geolocations
 */
export function useRecalculateCubePositionsWhenWeGetGeolocation() {
  const [cubes, setCubes] = useCubes();
  const [initialPosition] = useInitialPosition();
  const [initialGeolocation] = useInitialGeolocation();

  const { heading, loading } = useGeolocation();
  const getPositionFromGeolocation = useGetPositionFromGeolocation();
  useEffectOnce({
    callback: () => {
      setCubes((prevCubes) =>
        prevCubes.map((cube) => {
          const positionInWorld = getPositionFromGeolocation(cube.geolocation);
          const relativeGeolocation = {
            altitude: cube.geolocation.altitude - initialGeolocation.altitude,
            latitude: cube.geolocation.latitude - initialGeolocation.latitude,
            longitude:
              cube.geolocation.longitude - initialGeolocation.longitude,
          };
          const positionInScene =
            getPositionFromGeolocation(relativeGeolocation);
          // const positionInScene = [
          //   initialPosition[0] - positionInWorld[0],
          //   initialPosition[1] - positionInWorld[1],
          //   initialPosition[2] - positionInWorld[2],
          // ];
          console.log("🌟🚨 ~ RE-DERIVED positionInWorld", positionInWorld);
          console.log(
            "🌟🚨 ~ prevCubes.map ~ positionInScene",
            positionInScene
          );
          return {
            ...cube,
            positionInScene,
          };
        })
      );
    },
    shouldRun:
      initialGeolocation &&
      initialPosition &&
      !loading &&
      Boolean(heading) &&
      cubes.length > 0,
    dependencies: [heading, cubes],
  });
}
