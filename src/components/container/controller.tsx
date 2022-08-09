import { Center, HStack } from "@chakra-ui/react";
import { AppContext } from "store/index";
import { Jogging, Setting, SideBar, ObjectDetecting } from "components/index";
import { useContext } from "react";

export function Controller() {
  const { state } = useContext(AppContext);
  return (
    <HStack w="100vw" h="100vh">
      <SideBar />
      <Center width="100%">
        {state.controller.controllerIndex === 0 ? (
          <Jogging />
        ) : state.controller.controllerIndex === 1 ? (
          <ObjectDetecting />
        ) : state.controller.controllerIndex === 2 ? (
          <Setting />
        ) : null}
      </Center>
    </HStack>
  );
}
