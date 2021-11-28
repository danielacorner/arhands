import * as THREE from "three";
// import { proxy, subscribe, snapshot } from "valtio";
// import * as Y from "yjs";
// import { bindProxyAndYMap } from "valtio-yjs";
// import { WebrtcProvider } from "y-webrtc";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

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

export type CubeType = {
  positionInWorld: [number, number, number] | number[];
  positionInScene: [number, number, number] | number[];
  geolocation: { altitude: number; latitude: number; longitude: number };
};
export const cubesAtom = atomWithStorage<CubeType[]>("atom:cubes4", []);
export const useCubes = () => {
  return useAtom(cubesAtom);
};
export const initialPositionAtom = atomWithStorage<
  number[] | [number, number, number]
>("initialPosition", [0, 0, 0]);
export const useInitialPosition = () => {
  return useAtom(initialPositionAtom);
};

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
