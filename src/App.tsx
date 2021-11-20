import { useRef, useState } from "react";
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
// import { Box } from "./components/Box";

function App() {
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

export default App;

function Scene() {
  const { px, py, pz } = { px: -2.15, py: 5, pz: 0.1 };
  const { x, y, z } = useControls({ x: 0, y: -1, z: -1 });
  return (
    <>
      <ambientLight intensity={0.4} />
      <HitTestExample />
      <directionalLight position={[px, py, pz]} intensity={4} />
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

  return (
    // <Interactive ref={ref}>
    <Box
      ref={ref}
      // position={[0, 0, 0]}
      args={[0.1, 0.1, 0.1]}
      material-transparent={true}
      material-opacity={0.5}
      material-color={"#ad0606"}
      /* scale={0.1} */ {...({} as any)}
    />
    // </Interactive>
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
