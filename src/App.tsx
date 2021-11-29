/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import { ARCanvas, useXR } from "@react-three/xr";
import { Leva } from "leva";
import styled from "styled-components/macro";
import { useWindowSize } from "react-use";
import { useEffectOnce } from "./hooks/useEffectOnce";
import { useInitialPosition, useIsPresenting } from "./store";
import { useCameraPositionFromGeolocation } from "./hooks/useCameraPositionFromGeolocation";
import { Scene } from "./Scene";

export default function App() {
  // const { controllers, player } = useXR();
  useStoreInitialGeolocation();
  const { height, width } = useWindowSize();

  const [isPresenting] = useIsPresenting();

  return (
    <>
      <AppStyles className="App">
        {!isPresenting && (
          <header className="App-header">
            <div className="cta">Click "Start AR" 👇</div>
          </header>
        )}
      </AppStyles>
      {process.env.NODE_ENV === "development" && <Leva />}
      <ARCanvas
        onAbort={() => {
          console.log("onAbort");
        }}
        sessionInit={
          {
            // requiredFeatures: ["hit-test"],
            optionalFeatures: ["dom-overlay"],
            domOverlay: { root: document.body },
          } as any
        }
        style={{
          width,
          height,
        }}
      >
        {/* <DefaultXRControllers />
            <Hands /> */}
        <Scene />
      </ARCanvas>
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

/** store the first geolocation we receive */
function useStoreInitialGeolocation() {
  const [, setInitialPosition] = useInitialPosition();
  const position = useCameraPositionFromGeolocation();
  useEffectOnce({
    callback: () => {
      console.log("🌟🚨 ~ useStoreInitialGeolocation ~ position", position);
      setInitialPosition(position);
    },
    shouldRun: position[0] !== 0,
    dependencies: [position],
  });
}
