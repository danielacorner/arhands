import { forwardRef } from "react";

export const Box = forwardRef<any, any>(
  (
    {
      color = "#9e9e9e",
      args,
      scale = [1, 1, 1],
      geometryProps = {},
      materialProps = {},
      children,
      ...rest
    },
    ref
  ) => {
    return (
      <mesh ref={ref} scale={scale} {...rest}>
        <boxBufferGeometry args={args} {...geometryProps} />
        <meshPhongMaterial color={color} {...materialProps} />
        {children}
      </mesh>
    );
  }
);
