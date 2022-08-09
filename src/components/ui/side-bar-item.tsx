import { HStack, Text } from "@chakra-ui/react";
import { AppContext, Types } from "store/index";
import { ReactNode, useContext } from "react";

export function SideBarItem({
  label,
  icon,
  index,
}: {
  label: string;
  icon: ReactNode;
  index: number;
}) {
  const { state, dispatch } = useContext(AppContext);
  return (
    <HStack
      color={index === state.controller.controllerIndex ? "black" : "white"}
      width="100%"
      m={3}
      border="1px solid white"
      p={2}
      borderRadius="8px"
      _hover={{
        cursor: "pointer",
        transform: "scale(1.05)",
        transition: "all 0.5s",
      }}
      onClick={() => {
        dispatch({
          type: Types.SET_SIDE_BAR_INDEX,
          payload: { controllerIndex: index },
        });
        dispatch({
          type: Types.OBJECT_DETECTING_DEFAULT,
          payload: {},
        });
      }}
      backgroundColor={
        index === state.controller.controllerIndex ? "white" : ""
      }
      boxShadow={
        index === state.controller.controllerIndex
          ? "rgba(0, 0, 0, 0.18) 0px 2px 4px"
          : ""
      }
    >
      {icon}
      <HStack justifyContent="center" w="100%">
        <Text mx="auto">{label}</Text>
      </HStack>
    </HStack>
  );
}
