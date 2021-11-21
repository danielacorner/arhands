import { Box } from "@react-three/drei";
import { useRef } from "react";
import MinecraftHammer from "./components/MinecraftHammer";

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
export function Axe(props) {
  const group = useRef();
  return (
    <group ref={group} dispose={null} {...props}>
      <group rotation={[0, Math.PI / 1.8, -0.3]} scale={0.5}>
        <Box
          args={[0.1, 0.1, 0.1]}
          material-transparent={true}
          material-opacity={0.5}
          material-color={"#ad0606"}
          {...({} as any)}
        />
        <MinecraftHammer />
      </group>
    </group>
  );
}
