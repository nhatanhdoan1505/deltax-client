import { Button, HStack } from "@chakra-ui/react";
import { AppContext, Types } from "store";
import { useContext } from "react";

export function CropOption() {
  const { dispatch } = useContext(AppContext);
  return (
    <HStack width="100%" justifyContent="flex-start" py={3}>
      <Button
        colorScheme="blue"
        onClick={() => {
          dispatch({
            type: Types.APPLY_CROP,
            payload: { objectDetecting: { applyCrop: true } },
          });
        }}
      >
        Apply
      </Button>
      <Button
        colorScheme="red"
        onClick={() => {
          dispatch({
            type: Types.SET_CROP_VALUE,
            payload: { objectDetecting: { crop: null! } },
          });
          dispatch({
            type: Types.SET_IMAGE_TOOL,
            payload: { objectDetecting: { indexTool: null! } },
          });
        }}
      >
        Cancel
      </Button>
    </HStack>
  );
}
