import "./App.css";
import {
  ARCanvas,
  DefaultXRControllers,
  Hands,
  Interactive,
  useXR,
  useHitTest,
} from "@react-three/xr";
import { Text, Box } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import { useRef, useCallback, useEffect, useState } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import { Sky, PointerLockControls, useGLTF } from "@react-three/drei";
import { Physics, useBox, useSphere, usePlane } from "@react-three/cannon";
import { proxy, subscribe, snapshot } from "valtio";
import * as Y from "yjs";
import { bindProxyAndYMap } from "valtio-yjs";
import { WebrtcProvider } from "y-webrtc";
// import axeUrl from "./assets/axe.glb";

const SPEED = 5;
const keys = {
  KeyW: "forward",
  KeyS: "backward",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};
const moveFieldByKey = (key) => keys[key];
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();
const rotation = new THREE.Vector3();
const speed = new THREE.Vector3();
const ydoc = new Y.Doc();
const ymap = ydoc.getMap("map");
const cubeStore = proxy({ cubes: [] as [x: number, y: number, z: number][] });
const addCube = ([x, y, z]) => cubeStore.cubes.push([x, y, z]);

new WebrtcProvider("minecraft-valtio-yjs-demo-2", ydoc);
bindProxyAndYMap(cubeStore, ymap);

function useCubes() {
  const [slice, setSlice] = useState(() => snapshot(cubeStore).cubes);
  useEffect(
    () => void subscribe(cubeStore, () => setSlice(snapshot(cubeStore).cubes)),
    []
  );
  return slice || [];
}

function usePlayerControls() {
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
  });
  useEffect(() => {
    const handleKeyDown = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
    const handleKeyUp = (e) =>
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => (
      document.removeEventListener("keydown", handleKeyDown),
      document.removeEventListener("keyup", handleKeyUp)
    );
  }, []);
  return movement;
}

// export default function App() {
//   return (
//     <Canvas
//       shadows
//       gl={{ alpha: false }}
//       camera={{ fov: 45 }}
//       raycaster={{
//         computeOffsets: (e) => ({
//           offsetX: e.target.width / 2,
//           offsetY: e.target.height / 2,
//         }),
//       }}
//     >
//       <Sky sunPosition={[100, 20, 100]} />
//       <ambientLight intensity={0.3} />
//       <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />

//     </Canvas>
//   );
// }

function Axe(props) {
  const group = useRef();
  // const { nodes, materials } = useGLTF(axeUrl) as any;
  return (
    <group ref={group} dispose={null} {...props}>
      <group rotation={[0, Math.PI / 1.8, -0.3]} scale={0.5}>
        <Box
          args={[0.1, 0.1, 0.1]}
          material-transparent={true}
          material-opacity={0.5}
          material-color={"#ad0606"}
          {...({} as any)}
          // material-color={isHovered ? "#06ad30" : "#ad0606"}
        />
        {/* <mesh
          geometry={nodes.Mesh_1001_1.geometry}
          material={materials.material_2}
        />
        <mesh
          geometry={nodes.Mesh_1001_2.geometry}
          material={materials.material_3}
        /> */}
      </group>
    </group>
  );
}

function Player(props) {
  const axe = useRef<any>();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: "Dynamic",
    position: [0, 10, 0],
    ...props,
  }));
  const { forward, backward, left, right, jump } = usePlayerControls();
  const { camera } = useThree();
  const velocity = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), []);
  useFrame((state) => {
    // ref.current.getWorldPosition(camera.position);
    // frontVector.set(0, 0, Number(backward) - Number(forward));
    // sideVector.set(Number(left) - Number(right), 0, 0);
    // direction
    //   .subVectors(frontVector, sideVector)
    //   .normalize()
    //   .multiplyScalar(SPEED)
    //   .applyEuler(camera.rotation);
    speed.fromArray(velocity.current);

    axe.current.children[0].rotation.x = THREE.MathUtils.lerp(
      axe.current.children[0].rotation.x,
      Math.sin(((speed.length() > 1) as any) * state.clock.elapsedTime * 10) /
        6,
      0.1
    );
    axe.current.rotation.copy(camera.rotation);
    axe.current.position
      .copy(camera.position)
      .add(camera.getWorldDirection(rotation).multiplyScalar(1));

    // api.velocity.set(direction.x, velocity.current[1], direction.z);
    // if (jump && Math.abs(velocity.current[1].toFixed(2)) < 0.05)
    //   api.velocity.set(velocity.current[0], 10, velocity.current[2]);
  });
  return (
    <>
      <mesh ref={ref} />
      <group
        ref={axe}
        onPointerMissed={(e) => (axe.current.children[0].rotation.x = -0.5)}
      >
        <Axe position={[0.15, -0.35, 0.5]} />
      </group>
    </>
  );
}

function Cube(props) {
  const [ref] = useBox(() => ({ type: "Static", ...props }));
  const [hover, set] = useState<any>(null);
  // const texture = useLoader(THREE.TextureLoader, dirt);
  const onMove = useCallback(
    (e) => (e.stopPropagation(), set(Math.floor(e.faceIndex / 2))),
    []
  );
  const onOut = useCallback(() => set(null), []);
  const onClick = useCallback((e) => {
    if (!ref.current) {
      return;
    }
    e.stopPropagation();
    const { x, y, z } = ref.current.position;
    const dir = [[x + 1, y, z], [x - 1, y, z], [x, y + 1, z], [x, y - 1, z], [x, y, z + 1], [x, y, z - 1]] // prettier-ignore
    addCube(dir[Math.floor(e.faceIndex / 2)] as any);
  }, []);
  return (
    <mesh
      ref={ref}
      receiveShadow
      castShadow
      onPointerMove={onMove}
      onPointerOut={onOut}
      onClick={onClick}
    >
      {[...Array(6)].map((_, index) => (
        <meshStandardMaterial
          attachArray="material"
          key={index}
          // map={texture}
          color={hover === index ? "hotpink" : "white"}
        />
      ))}
      <boxGeometry />
    </mesh>
  );
}

function Cubes() {
  const cubes = useCubes();
  return (
    <>
      {cubes.map((coords, index) => (
        <Cube key={index} position={coords} />
      ))}
    </>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const { controllers, player } = useXR();
  console.log("🌟🚨 ~ App ~ player", player);
  console.log("🌟🚨 ~ App ~ controllers", controllers);

  return (
    <div className="App">
      <header className="App-header">
        Click "Start AR" 👇
        <ARCanvas sessionInit={{ requiredFeatures: ["hit-test"] }}>
          <DefaultXRControllers />
          <Hands />
          <Scene />
        </ARCanvas>
      </header>
    </div>
  );
}

function Scene() {
  const { px, py, pz } = { px: -2.15, py: 5, pz: 0.1 };
  const { x, y, z } = useControls({ x: 0, y: -1, z: -1 });
  return (
    <>
      <ambientLight intensity={0.4} />
      <HitTestExample />
      <directionalLight position={[px, py, pz]} intensity={4} />
      <Physics gravity={[0, -30, 0]}>
        <Player />
        <Cube position={[0, 0.5, -10]} />
        <Cubes />
      </Physics>
      <PointerLockControls {...({} as any)} />
      {/* <Button position={[x, y, z]}  /> */}
    </>
  );
}

function HitTestExample() {
  const ref = useRef<any>(null);
  useHitTest((hit) => {
    if (!ref.current) {
      return;
    }
    hit.decompose(
      ref.current.position,
      ref.current.rotation,
      ref.current.scale
    );
  });

  const [isHovered, setIsHovered] = useState(false);
  const [boxes, setBoxes] = useState<{ position: number[] }[]>([]);

  const handleSelect = () => {
    console.log("🚨 ~ HitTestExample ~ handleSelect");
    const newBox = { position: ref.current.position };
    setBoxes((prevBoxes) => [...prevBoxes, newBox]);
  };
  return (
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
      onSqueezeStart={() => console.log("🚨 ~ HitTestExample ~ onSqueezeStart")}
    >
      <Box
        ref={ref}
        // position={[0, 0, 0]}
        args={[0.1, 0.1, 0.1]}
        material-transparent={true}
        material-opacity={0.5}
        material-color={isHovered ? "#06ad30" : "#ad0606"}
        /* scale={0.1} */ {...({} as any)}
      />
      {boxes.map(({ position }) => (
        <Box
          ref={ref}
          position={position}
          args={[0.1, 0.1, 0.1]}
          material-transparent={true}
          material-opacity={0.5}
          material-color={isHovered ? "#06ad30" : "#ad0606"}
          /* scale={0.1} */ {...({} as any)}
        />
      ))}
    </Interactive>
  );
}

// function Button(props: any) {
//   const [hover, setHover] = useState(false);
//   const [color, setColor] = useState<any>("tomato");

//   const onSelect = () => {
//     setColor((Math.random() * 0xffffff) | 0);
//   };

//   const ref = useRef(null as any);
//   useHitTest((hit) => {
//     if (!ref.current) {
//       return;
//     }
//     hit.decompose(
//       ref.current.position,
//       ref.current.rotation,
//       ref.current.scale
//     );
//   });

//   return (
//     <Interactive
//       onHover={() => setHover(true)}
//       onBlur={() => setHover(false)}
//       onSelect={onSelect}
//     >
//       <Box
//         ref={ref}
//         color={color}
//         scale={hover ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]}
//         size={[0.4, 0.1, 0.1]}
//         {...props}
//       >
//         <Text
//           position={[0, 0, 0.06]}
//           fontSize={0.05}
//           color="#000"
//           anchorX="center"
//           anchorY="middle"
//           {...({} as any)}
//         >
//           Hello react-xr!
//         </Text>
//       </Box>
//     </Interactive>
//   );
// }
