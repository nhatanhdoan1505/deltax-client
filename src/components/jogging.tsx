import {
  Grid,
  GridItem,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AppContext, Types } from "store/index";
import { ButtonController } from "components";
import { useContext } from "react";

export function Jogging() {
  const DIVISION = [0.5, 1, 5, 10, 50];
  const { state, dispatch } = useContext(AppContext);

  return (
    <VStack
      p={5}
      boxShadow="rgba(0, 0, 0, 0.24) 0px 3px 8px;"
      borderRadius="8px"
      w="100%"
      maxW="800px"
    >
      <Text fontWeight="bold" fontSize="lg" mb={10}>
        JOGGING
      </Text>
      <Grid
        w="100%"
        templateColumns="repeat(1, 2fr)"
        gap={3}
        p={6}
        borderRadius="8px"
        boxShadow="rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;"
      >
        <HStack w="100%" justifyContent="center">
          {DIVISION.map((d) => (
            <ButtonController
              label={d.toString()}
              data={`r:Change Division ${d}`}
              isRadioButton={true}
              colorScheme="green"
              isJoggingButton={false}
              key={d}
            />
          ))}
        </HStack>
        <Grid templateColumns="repeat(5, 1fr)" w="100%" mt={5}>
          <GridItem colSpan={3}>
            <VStack justifyContent="center" alignContent="center">
              <HStack>
                <ButtonController
                  label="FORWARD"
                  data="r:Move Forward"
                  isRadioButton={false}
                  colorScheme="orange"
                  isJoggingButton={true}
                />
              </HStack>
              <HStack justifyContent="space-between" w="90%">
                <ButtonController
                  label="LEFT"
                  data="r:Move Left"
                  isRadioButton={false}
                  colorScheme="orange"
                  isJoggingButton={true}
                />
                <ButtonController
                  label="RIGHT"
                  data="r:Move Right"
                  isRadioButton={false}
                  colorScheme="orange"
                  isJoggingButton={true}
                />
              </HStack>
              <HStack>
                <ButtonController
                  label="BACKWARD"
                  data="r:Move Backward"
                  isRadioButton={false}
                  colorScheme="orange"
                  isJoggingButton={true}
                />
              </HStack>
            </VStack>
          </GridItem>
          <GridItem colSpan={2}>
            <VStack
              h="100%"
              justifyContent="space-between"
              alignContent="center"
            >
              <ButtonController
                label="UP"
                data="r:Move Up"
                isRadioButton={false}
                colorScheme="orange"
                isJoggingButton={true}
              />
              <ButtonController
                label="DOWN"
                data="r:Move Down"
                isRadioButton={false}
                colorScheme="orange"
                isJoggingButton={true}
              />
            </VStack>
          </GridItem>
        </Grid>
      </Grid>
      <ButtonController
        label="HOME"
        data="r:HOME"
        isRadioButton={false}
        colorScheme="blue"
        isJoggingButton={false}
      />
      <HStack w="100%" mb={5}>
        <Text whiteSpace="nowrap" fontStyle="oblique" fontWeight="light">
          Button Rate
        </Text>
        <Slider
          aria-label="slider-ex-2"
          colorScheme="pink"
          onChangeEnd={(value) =>
            dispatch({
              type: Types.SPEED,
              payload: { jogging: { speech: value } },
            })
          }
        >
          <SliderMark
            value={state.controller.jogging.speech}
            textAlign="center"
            bg="blue.500"
            color="white"
            mt="-10"
            ml="-5"
            w="12"
          >
            {state.controller.jogging.speech}
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </HStack>
    </VStack>
  );
}
