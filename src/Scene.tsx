import { Physics } from "@react-three/cannon";
import { Player } from "./components/Player";
import { Cubes } from "./components/Cubes";
import { PlaceableBlock } from "./components/PlaceableBlock";
import { Billboard, Box, Html } from "@react-three/drei";
import { useState } from "react";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import { BOX_WIDTH } from "./utils/constants";
import { useEmojiPickerPosition } from "./store";

export function Scene() {
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
      <EmojiPickerMenu />
      <PlaceableBlock />
    </>
  );
}

function EmojiPickerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [emoji, setEmoji] = useState("🤔");
  const [emojiPickerPosition] = useEmojiPickerPosition();
  console.log(
    "🌟🚨 ~ EmojiPickerMenu ~ emojiPickerPosition",
    emojiPickerPosition
  );
  const [isHovered, setIsHovered] = useState(false);
  return emojiPickerPosition ? (
    <mesh
      onPointerOver={() => setIsHovered(true)}
      onPointerOut={() => setIsHovered(false)}
      position={emojiPickerPosition as any}
      // scale={[0.6, 0.6, 0.6]}
      onClick={() => setIsOpen((p) => !p)}
    >
      <Box
        material-color="#ceb422d6"
        args={[BOX_WIDTH / 2, BOX_WIDTH / 2, BOX_WIDTH / 2]}
      />
      <Billboard>
        <Html transform={true}>
          <Picker title="Pick your emoji…" emoji="point_up" />
        </Html>
      </Billboard>
    </mesh>
  ) : null;
}
