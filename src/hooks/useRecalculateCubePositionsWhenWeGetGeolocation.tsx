import { useGeolocation } from "react-use";
import { useCubes, useInitialPosition } from "../store";
import { useGetPositionFromGeolocation } from "../components/PlaceableBlock";
import { useEffectOnce } from "./useEffectOnce";

/** when we get the geolocation,
 * re-derive any stored cube positions in the scene from their geolocations
 */
export function useRecalculateCubePositionsWhenWeGetGeolocation() {
  const [cubes, setCubes] = useCubes();
  const [initialPosition] = useInitialPosition();

  const { heading, loading } = useGeolocation();
  const getPositionFromGeolocation = useGetPositionFromGeolocation();
  useEffectOnce({
    callback: () => {
      setCubes((prevCubes) =>
        prevCubes.map((cube) => {
          const positionInWorld = getPositionFromGeolocation(cube.geolocation);
          const positionInScene = [
            initialPosition[0] - positionInWorld[0],
            initialPosition[1] - positionInWorld[1],
            initialPosition[2] - positionInWorld[2],
          ];
          console.log("🌟🚨 ~ RE-DERIVED positionInWorld", positionInWorld);
          return {
            ...cube,
            positionInWorld,
            positionInScene,
          };
        })
      );
    },
    shouldRun:
      initialPosition[0] !== 0 &&
      !loading &&
      Boolean(heading) &&
      cubes.length > 0,
    dependencies: [heading, cubes],
  });
}
