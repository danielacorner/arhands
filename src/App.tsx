import { useState } from "react";
import "./App.css";
import {
  ARCanvas,
  DefaultXRControllers,
  Hands,
  Interactive,
  useXR,
} from "@react-three/xr";
import { Text } from "@react-three/drei";

function App() {
  const [count, setCount] = useState(0);
  const { controllers, player } = useXR();
  console.log("🌟🚨 ~ App ~ player", player);
  console.log("🌟🚨 ~ App ~ controllers", controllers);

  return (
    <div className="App">
      <header className="App-header">
        Click "Start AR" 👇
        <ARCanvas>
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
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[px, py, pz]} intensity={4} />
      <Button position={[0, 0.1, -0.2]} />
    </>
  );
}

function Box({ color, size, scale, children, ...rest }: any) {
  return (
    <mesh scale={scale} {...rest}>
      <boxBufferGeometry attach="geometry" args={size} />
      <meshPhongMaterial attach="material" color={color} />
      {children}
    </mesh>
  );
}
function Button(props: any) {
  const [hover, setHover] = useState(false);
  const [color, setColor] = useState<any>("blue");

  const onSelect = () => {
    setColor((Math.random() * 0xffffff) | 0);
  };

  return (
    <Interactive
      onHover={() => setHover(true)}
      onBlur={() => setHover(false)}
      onSelect={onSelect}
    >
      <Box
        color={color}
        scale={hover ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5]}
        size={[0.4, 0.1, 0.1]}
        {...props}
      >
        <Text
          position={[0, 0, 0.06]}
          fontSize={0.05}
          color="#000"
          anchorX="center"
          anchorY="middle"
          {...({} as any)}
        >
          Hello react-xr!
        </Text>
      </Box>
    </Interactive>
  );
}
