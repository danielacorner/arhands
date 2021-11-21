import * as THREE from "three";
import { useEffect, useState } from "react";
import { proxy, subscribe, snapshot } from "valtio";
import * as Y from "yjs";
import { bindProxyAndYMap } from "valtio-yjs";
import { WebrtcProvider } from "y-webrtc";

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
const ydoc = new Y.Doc();
const ymap = ydoc.getMap("map");
const cubeStore = proxy({ cubes: [] as [x: number, y: number, z: number][] });
export const addCube = ([x, y, z]) => cubeStore.cubes.push([x, y, z]);
new WebrtcProvider("minecraft-valtio-yjs-demo-2", ydoc);
bindProxyAndYMap(cubeStore, ymap);

export function useCubes() {
  const [slice, setSlice] = useState(() => snapshot(cubeStore).cubes);
  useEffect(
    () => void subscribe(cubeStore, () => setSlice(snapshot(cubeStore).cubes)),
    []
  );
  return slice || [];
}
