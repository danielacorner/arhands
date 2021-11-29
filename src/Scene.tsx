import { Physics } from "@react-three/cannon";
import { Player } from "./components/Player";
import { Cubes } from "./components/Cubes";
import { PlaceableBlock } from "./components/PlaceableBlock";
import { useEffect } from "react";
import "emoji-mart/css/emoji-mart.css";
import { useIsPresenting } from "./store";
import { useXR } from "@react-three/xr";
import { EmojiPickerMenu } from "./EmojiPickerMenu";

export function Scene() {
  const { px, py, pz } = { px: -2.15, py: 5, pz: 0.1 };

  // sync isPresenting to store
  const { isPresenting } = useXR();
  const [, setIsPresenting] = useIsPresenting();
  useEffect(() => {
    setIsPresenting(isPresenting);
  }, [isPresenting, setIsPresenting]);

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* <PlaceableBlock /> */}
      <directionalLight position={[px, py, pz]} intensity={4} />
      <Physics gravity={[0, -30, 0]}>
        <Player />
      </Physics>
      <Cubes />
      <EmojiPickerMenu />
      <PlaceableBlock />
    </>
  );
}
