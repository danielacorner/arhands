import { Billboard, Html } from "@react-three/drei";
import { Picker } from "emoji-mart";
import { useCubes, useEmojiPickerPosition } from "./store";
import isEqual from "lodash.isequal";
import { ClickAwayListener } from "@mui/material";

export function EmojiPickerMenu() {
  const [emojiPickerPosition, setEmojiPickerPosition] =
    useEmojiPickerPosition();
  console.log(
    "🌟🚨 ~ EmojiPickerMenu ~ emojiPickerPosition",
    emojiPickerPosition
  );
  const [, setCubes] = useCubes();

  return emojiPickerPosition ? (
    <mesh
      position={emojiPickerPosition as any}
      // scale={[0.6, 0.6, 0.6]}
    >
      <Billboard
        onPointerMissed={() => {
          setEmojiPickerPosition(null);
        }}
      >
        <Html center={true} transform={true} scale={0.08}>
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
      </Billboard>
    </mesh>
  ) : null;
}
