import { Interactive, useHitTest } from "@react-three/xr";
import { Box } from "@react-three/drei";
import { useRef, useState } from "react";
import { useGeolocation } from "react-use";

export function HitTestClickable() {
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

  const {
    altitude,
    latitude,
    longitude,
    loading,
    // accuracy,
    // altitudeAccuracy,
    // heading,
    // speed,
    // timestamp,
  } = useGeolocation();
  console.log("🌟🚨 ~ HitTestClickable ~ geolocation", {
    altitude,
    latitude,
    longitude,
    loading,
    // accuracy,
    // altitudeAccuracy,
    // heading,
    // speed,
    // timestamp,
  });

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
