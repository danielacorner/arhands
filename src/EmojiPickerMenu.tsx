import { Box, Html } from "@react-three/drei";
import { useState } from "react";
import { Picker } from "emoji-mart";
import { BOX_WIDTH } from "./utils/constants";
import { useCubes, useEmojiPickerPosition } from "./store";
import isEqual from "lodash.isequal";

export function EmojiPickerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] =
    useEmojiPickerPosition();
  console.log(
    "🌟🚨 ~ EmojiPickerMenu ~ emojiPickerPosition",
    emojiPickerPosition
  );
  const [isHovered, setIsHovered] = useState(false);
  const [, setCubes] = useCubes();

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
      <Html transform={true} scale={0.1}>
        <Picker
          title="Pick your emoji…"
          emoji="point_up"
          onClick={(
            {
              native,
              //             colons: ":innocent:"
              // emoticons: []
              // id: "innocent"
              // name: "Smiling Face with Halo"
              // native: "😇"
              // short_names: ['innocent']
              // skin: null
              // unified: "1f607"
            },
            event
          ) => {
            event.stopPropagation();
            console.log("🌟🚨 ~ EmojiPickerMenu ~ native", native);

            setCubes((p) =>
              p.map((cube) =>
                isEqual(cube.positionInScene, emojiPickerPosition)
                  ? { ...cube, emoji: native }
                  : cube
              )
            );
            setTimeout(() => {
              setEmojiPickerPosition(null);
            }, 0);
          }}
        />
      </Html>
    </mesh>
  ) : null;
}
