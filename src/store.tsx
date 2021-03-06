import * as THREE from "three";
// import { proxy, subscribe, snapshot } from "valtio";
// import * as Y from "yjs";
// import { bindProxyAndYMap } from "valtio-yjs";
// import { WebrtcProvider } from "y-webrtc";
import { atomWithStorage } from "jotai/utils";
import { atom, useAtom } from "jotai";

// const SPEED = 5;
const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};
export const moveFieldByKey = (key) => keys[key];
// const direction = new THREE.Vector3();
// const frontVector = new THREE.Vector3();
// const sideVector = new THREE.Vector3();
export const rotation = new THREE.Vector3();
export const speed = new THREE.Vector3();

/** These cubes can be placed around the scene.
 */
export type CubeType = {
  /** The camera starts at position [0, 0, 0], and each cube position is relative to that.
   * This is derivable from geolocation.
   */
  positionInScene: [number, number, number] | number[];
  /** The cube's geolocation. This can be used to determine its position. */
  geolocation: { altitude: number; latitude: number; longitude: number };
  /** an emoji that appears inside the box */
  emoji: string;
};
export const cubesAtom = atomWithStorage<CubeType[]>("atom:cubes5", []);
export const useCubes = () => {
  return useAtom(cubesAtom);
};

export const initialPositionAtom = atomWithStorage<
  null | number[] | [number, number, number]
>("atom:initialPosition", null);
export const useInitialPosition = () => {
  return useAtom(initialPositionAtom);
};

export const initialGeolocationAtom = atomWithStorage<null | {
  altitude: number;
  latitude: number;
  longitude: number;
}>("atom:initialGeolocation", null);
export const useInitialGeolocation = () => {
  return useAtom(initialGeolocationAtom);
};

export const emojiPickerPositionAtom = atom<
  null | number[] | [number, number, number]
>(null);
export const useEmojiPickerPosition = () => {
  return useAtom(emojiPickerPositionAtom) as [
    [number, number, number] | number[],
    any
  ];
};
export const isPresentingAtom = atom<boolean>(false);
export const useIsPresenting = () => {
  return useAtom(isPresentingAtom);
};
// export const selectedPositionAtom = atom<number[] | [number, number, number]>([
//   0, 0, 0,
// ]);
// export const useSelectedPosition = () => {
//   return useAtom(selectedPositionAtom);
// };

// const ydoc = new Y.Doc();
// const ymap = ydoc.getMap("map");
// const cubeStore = proxy({ cubes: [] as [x: number, y: number, z: number][] });
// export const addCube = ([x, y, z]) => cubeStore.cubes.push([x, y, z]);
// new WebrtcProvider("minecraft-valtio-yjs-demo-2", ydoc);
// bindProxyAndYMap(cubeStore, ymap);

// export function useCubes() {
//   const [slice, setSlice] = useState(() => snapshot(cubeStore).cubes);
//   useEffect(
//     () => void subscribe(cubeStore, () => setSlice(snapshot(cubeStore).cubes)),
//     []
//   );
//   return slice || [];
// }
