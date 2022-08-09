import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { AppContext, Types } from "store/index";
import { useContext, useEffect, useState } from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

export function Setting() {
  const { state, dispatch } = useContext(AppContext);

  const [ipTemporary, setIpTemporary] = useState<string>(
    state.controller.setting.ip
  );

  const [portTemporary, setPortTemporary] = useState<string>(
    state.controller.setting.port.toString()
  );

  const [isConnected, setIsConnected] = useState<boolean>(
    state.controller.setting.socket.id ? true : false
  );

  const socketSelector = state.controller.setting.socket;

  const onSubmitHandler = async () => {
    setIsConnected(false);
    ipTemporary &&
      +portTemporary &&
      dispatch({
        type: Types.SET_CONNECTION,
        payload: { setting: { ip: ipTemporary, port: +portTemporary } },
      });
  };

  useEffect(() => {
    socketSelector.on("connection", () => {
      setIsConnected(true);
    });
  }, [socketSelector]);

  return (
    <VStack
      width="100%"
      height="100vh"
      justifyContent="flex-start"
      alignItems="flex-start"
      p={3}
    >
      <VStack justifyContent="flex-start" alignItems="flex-start">
        <Text fontSize="xl" fontWeight="bold">
          Connection
        </Text>
        <HStack>
          <HStack justifyContent="flex-start" mr={3}>
            <Text whiteSpace="nowrap" fontWeight="medium">
              IP ADDRESS
            </Text>
            <Input
              placeholder="Enter IP Address"
              type="text"
              minW="300px"
              value={ipTemporary}
              onChange={(event) => setIpTemporary(event.target.value)}
            />
          </HStack>
          <HStack justifyContent="flex-start">
            <Text whiteSpace="nowrap" fontWeight="medium">
              PORT
            </Text>
            <Input
              placeholder="Port"
              maxWidth="100px"
              type="number"
              value={portTemporary}
              onChange={(event) => setPortTemporary(event.target.value)}
            />
          </HStack>
          <Button
            colorScheme="blue"
            disabled={ipTemporary && +portTemporary ? false : true}
            onClick={onSubmitHandler}
          >
            Connect
          </Button>
          {isConnected ? (
            <AiOutlineCheck color="green" />
          ) : (
            <AiOutlineClose color="red" />
          )}
        </HStack>
      </VStack>
    </VStack>
  );
}
