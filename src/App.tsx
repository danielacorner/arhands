/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import { ARCanvas, DefaultXRControllers, Hands, useXR } from "@react-three/xr";
import { Leva } from "leva";
import { useState } from "react";
import { Physics } from "@react-three/cannon";
import styled from "styled-components/macro";
import { useWindowSize } from "react-use";
import { Player } from "./components/Player";
import { Cube, Cubes } from "./components/Cubes";
import { PlaceableBlock } from "./components/PlaceableBlock";

export default function App() {
  const [count, setCount] = useState(0);
  const { controllers, player } = useXR();
  console.log("🌟🚨 ~ App ~ player", player);
  console.log("🌟🚨 ~ App ~ controllers", controllers);

  const { height, width } = useWindowSize();
  return (
    <>
      <AppStyles className="App">
        <header className="App-header">
          <div className="cta">Click "Start AR" 👇</div>

          <ARCanvas
            sessionInit={{ requiredFeatures: ["hit-test"] }}
            style={{
              width,
              height,
            }}
          >
            <DefaultXRControllers />
            <Hands />
            <Scene />
          </ARCanvas>
        </header>
      </AppStyles>
      {process.env.NODE_ENV === "development" && <Leva />}
    </>
  );
}

const AppStyles = styled.div`
  .cta {
    position: fixed;
    z-index: 2;
    top: 40vh;
    left: 0;
    right: 0;
    text-shadow: -2px 2px 3px #000, 2px 1px 3px #000;
  }
`;

function Scene() {
  const { px, py, pz } = { px: -2.15, py: 5, pz: 0.1 };
  return (
    <>
      <ambientLight intensity={0.4} />
      {/* <PlaceableBlock /> */}
      <directionalLight position={[px, py, pz]} intensity={4} />
      <Physics gravity={[0, -30, 0]}>
        <Player />
      </Physics>
      <Cubes />
      <PlaceableBlock />
    </>
  );
}
