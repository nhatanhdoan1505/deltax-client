import { Button, HStack } from "@chakra-ui/react";
import { Types } from "store/reducers";
import { useContext } from "react";
import { AiFillDelete } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";
import { AppContext } from "store/context";

export function ObjectOption() {
  const { dispatch } = useContext(AppContext);
  return (
    <HStack
      borderRadius="8px"
      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px"
      px={3}
      py={2}
      my={3}
    >
      <Button
        leftIcon={<AiFillDelete />}
        colorScheme="red"
        variant="ghost"
        onClick={() =>
          dispatch({
            type: Types.IS_DELETE_OBJECT,
            payload: { objectDetecting: { isDelete: true } },
          })
        }
      >
        Delete
      </Button>
      <Button
        leftIcon={<ImCancelCircle />}
        colorScheme="yellow"
        variant="ghost"
        onClick={() =>
          dispatch({
            type: Types.SET_CURRENT_OBJECT,
            payload: { objectDetecting: { currentObject: null! } },
          })
        }
      >
        Cancel
      </Button>
    </HStack>
  );
}
