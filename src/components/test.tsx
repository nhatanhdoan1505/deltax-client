import { Stage, Layer, Image } from "react-konva";
import useImage from "use-image";

export function Canvas() {
  const [image] = useImage("https://konvajs.org/assets/lion.png");
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Image image={image} />
      </Layer>
    </Stage>
  );
}
