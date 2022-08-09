import { VStack } from "@chakra-ui/react";
import { AiOutlineDrag, AiOutlineZoomIn } from "react-icons/ai";
import { BsCrop } from "react-icons/bs";
import { BiRectangle } from "react-icons/bi";
import { TbHandFinger } from "react-icons/tb";
import { ImageToolboxMenu } from ".";

export function ImageToolbox() {
  const menu = [
    {
      index: 0,
      icon: <BsCrop fontSize="2rem" />,
      iconFocus: <BsCrop color="red" fontSize="2rem" />,
      label: "CROP",
    },
    {
      index: 1,
      icon: <AiOutlineDrag fontSize="2rem" />,
      iconFocus: <AiOutlineDrag color="red" fontSize="2rem" />,
      label: "MOVE",
    },
    {
      index: 2,
      icon: <AiOutlineZoomIn fontSize="2rem" />,
      iconFocus: <AiOutlineZoomIn color="red" fontSize="2rem" />,
      label: "ZOOM",
    },
    {
      index: 3,
      icon: <BiRectangle fontSize="2rem" />,
      iconFocus: <BiRectangle color="red" fontSize="2rem" />,
      label: "DRAW",
    },
    {
      index: 4,
      icon: <TbHandFinger fontSize="2rem" />,
      iconFocus: <TbHandFinger color="red" fontSize="2rem" />,
      label: "HAND",
    },
  ];
  return (
    <VStack
      height="100vh"
      minWidth="100px"
      borderRadius="8px"
      boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;"
      py={3}
    >
      {menu.map((m) => (
        <ImageToolboxMenu {...m} key={m.index} />
      ))}
    </VStack>
  );
}
