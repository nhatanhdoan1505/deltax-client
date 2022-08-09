import { Center, HStack, VStack } from "@chakra-ui/react";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Image, Layer, Rect, Stage } from "react-konva";
import { AppContext, Types } from "store/index";
import useImage from "use-image";
import { getCenter, getDistance, getPositionZoom } from "utils";
import { CropOption, ImageToolbox, ObjectImage, ObjectOption } from ".";

export interface IStageProps {
  width: number;
  height: number;
}

export interface IRect {
  x: number;
  y: number;
  name?: string;
  width: number;
  height: number;
}

export function ObjectDetecting() {
  const { state, dispatch } = useContext(AppContext);
  const socketSelector = state.controller.setting.socket;
  const objectDetectingSelector = state.controller.objectDetecting;

  const [image, setImage] = useState<string>(
    "https://images.unsplash.com/photo-1534330786040-317bdb76ccff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMG1vZGVsfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  );
  const [imageCanvas] = useImage(
    "https://images.unsplash.com/photo-1534330786040-317bdb76ccff?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z2lybCUyMG1vZGVsfGVufDB8MnwwfHw%3D&auto=format&fit=crop&w=500&q=60"
  );

  const maxHeight = window.innerHeight > 600 ? 600 : window.innerHeight - 50;
  const [initialAspect, setInitialAspect] = useState<number>(1);
  const [initialWidth, setInitialWidth] = useState<number>(900);
  const [currentStage, setCurrentStage] = useState<IStageProps>(null!);

  const scaleBy = 1.01;

  const [lastCenter, setLastCenter] = useState<{ x: number; y: number }>(null!);
  const [lastDist, setLastDist] = useState<number>(0);

  const [rectList, setRectList] = useState<IRect[]>([]);
  const [annotations, setAnnotations] = useState<IRect[]>([]);
  const [newAnnotation, setNewAnnotation] = useState<IRect[]>([]);
  const objectRef = useRef<Konva.Rect[]>([]);

  const imageCanvasRef = useRef<Konva.Image>(null!);
  const stageRef = useRef<Konva.Stage>(null!);
  const zoomRef = useRef<Konva.Image>(null!);
  const zoomScope = 50;
  const [isZoom, setIsZoom] = useState<boolean>(false);

  // useEffect(() => {
  //   socketSelector.emit("IMAGE_DETECTING");
  // }, [socketSelector]);

  // useEffect(() => {
  //   socketSelector.on("image", ({ image }) => {
  //     setImage(image);
  //   });
  // }, [socketSelector]);

  const startDraw = () => {
    if (newAnnotation.length === 0) {
      const { x, y } = stageRef.current.getPointerPosition() as Vector2d;
      setNewAnnotation([
        {
          x: (x - stageRef.current.x()) / stageRef.current.scaleX(),
          y: (y - stageRef.current.y()) / stageRef.current.scaleY(),
          width: 0,
          height: 0,
        },
      ]);
    }
  };

  const drawing = () => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      let { x, y } = stageRef.current.getPointerPosition() as Vector2d;
      x = (x - stageRef.current.x()) / stageRef.current.scaleX();
      y = (y - stageRef.current.y()) / stageRef.current.scaleY();
      setNewAnnotation([
        {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
        },
      ]);
    }
  };

  const stopDraw = () => {
    if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      let { x, y } = stageRef.current.getPointerPosition() as Vector2d;
      x = (x - stageRef.current.x()) / stageRef.current.scaleX();
      y = (y - stageRef.current.y()) / stageRef.current.scaleY();
      const annotationToAdd = {
        x: sx,
        y: sy,
        width: x - sx,
        height: y - sy,
        name: Math.random().toString(),
      };
      annotations.push(annotationToAdd);
      setNewAnnotation([]);
      setAnnotations([]);
      setRectList([...rectList, annotationToAdd]);
    }
  };

  const onTouchMoveZoom = (evt: Konva.KonvaEventObject<TouchEvent>) => {
    evt.evt.preventDefault();
    const touch1 = evt.evt.touches[0];
    const touch2 = evt.evt.touches[1];

    if (touch1 && touch2) {
      if (stageRef.current.isDragging()) {
        stageRef.current.stopDrag();
      }

      const p1 = {
        x: touch1.clientX * imageCanvasRef.current.scaleX(),
        y: touch1.clientY * imageCanvasRef.current.scaleY(),
      };
      const p2 = {
        x: touch2.clientX * imageCanvasRef.current.scaleX(),
        y: touch2.clientY * imageCanvasRef.current.scaleY(),
      };

      const currentCenter = getCenter(p1, p2);
      if (!lastCenter) {
        setLastCenter(currentCenter);
        return;
      }

      const newCenter = getCenter(p1, p2);

      const dist = getDistance(p1, p2);

      const pointTo = {
        x: (newCenter.x - stageRef.current.x()) / stageRef.current.scaleX(),
        y: (newCenter.y - stageRef.current.y()) / stageRef.current.scaleX(),
      };

      let scale = lastDist
        ? stageRef.current.scaleX() * (dist / lastDist)
        : stageRef.current.scaleX();
      scale = scale < 1 ? 1 : scale;

      stageRef.current.scaleX(scale);
      stageRef.current.scaleY(scale);

      const dx = lastCenter
        ? newCenter.x - lastCenter.x
        : newCenter.x - currentCenter.x;
      const dy = lastCenter
        ? newCenter.y - lastCenter.y
        : newCenter.y - currentCenter.y;

      const newPos = {
        x: scale === 1 ? 0 : newCenter.x - pointTo.x * scale + dx,
        y: scale === 1 ? 0 : newCenter.y - pointTo.y * scale + dy,
      };

      stageRef.current.position(newPos);

      setLastDist(dist);
      setLastCenter(newCenter);
    }
  };

  const onWheel = (evt: KonvaEventObject<WheelEvent>) => {
    evt.evt.preventDefault();

    const oldScale = stageRef.current.scaleX();
    const pointer = stageRef.current.getPointerPosition() as Vector2d;

    const mousePointTo = {
      x: (pointer.x - stageRef.current.x()) / oldScale,
      y: (pointer.y - stageRef.current.y()) / oldScale,
    };

    let direction = evt.evt.deltaY > 0 ? 1 : -1;

    if (evt.evt.ctrlKey) {
      direction = -direction;
    }

    let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    newScale = newScale < 1 ? 1 : newScale;
    stageRef.current.scale({
      x: newScale,
      y: newScale,
    });

    const newPos = {
      x: newScale === 1 ? 0 : pointer.x - mousePointTo.x * newScale,
      y: newScale === 1 ? 0 : pointer.y - mousePointTo.y * newScale,
    };

    stageRef.current.position(newPos);
  };

  const scaleImage = useCallback(
    ({
      newHeight,
      newWidth,
      newAspect,
      naturalWidth,
      naturalHeight,
    }: {
      newWidth: number;
      newHeight: number;
      newAspect: number;
      naturalWidth: number;
      naturalHeight: number;
    }) => {
      let width = newWidth;
      let height = newHeight;
      if (newWidth >= newHeight) {
        width = newWidth > maxHeight ? maxHeight : newWidth;
        height = width / newAspect;
      } else {
        height = newHeight > maxHeight ? maxHeight : newHeight;
        width = height * newAspect;
      }
      const scaleX = width / naturalWidth;
      const scaleY = height / naturalHeight;

      imageCanvasRef.current.scaleX(scaleX);
      imageCanvasRef.current.scaleY(scaleY);

      setCurrentStage({ width, height });
    },
    [maxHeight]
  );

  const applyCrop = useCallback(() => {
    const { naturalWidth, naturalHeight } = imageCanvasRef.current.attrs.image;
    const { crop } = objectDetectingSelector;

    const width = (crop.width * naturalWidth) / 100;
    const height = (crop.height * naturalHeight) / 100;
    const x = (crop.x * naturalWidth) / 100;
    const y = (crop.y * naturalHeight) / 100;
    imageCanvasRef.current.crop({ width, height, x, y });

    imageCanvasRef.current.x(0);
    imageCanvasRef.current.y(0);
    stageRef.current.scaleX(1);
    stageRef.current.scaleY(1);
    stageRef.current.x(0);
    stageRef.current.y(0);

    scaleImage({
      newWidth: width,
      newHeight: height,
      newAspect: width / height,
      naturalWidth,
      naturalHeight,
    });
  }, [objectDetectingSelector, scaleImage]);

  const copyImageProperty = () => {
    let x = imageCanvasRef.current.x();
    let y = imageCanvasRef.current.y();
    let scaleX = imageCanvasRef.current.scaleX();
    let scaleY = imageCanvasRef.current.scaleY();
    let image = imageCanvasRef.current.image();
    zoomRef.current.x(x);
    zoomRef.current.y(y);
    zoomRef.current.scaleX(scaleX);
    zoomRef.current.scaleY(scaleY);
    zoomRef.current.image(image);
  };

  useEffect(() => {
    if (
      imageCanvasRef.current &&
      imageCanvasRef.current.attrs &&
      imageCanvasRef.current.attrs.image
    ) {
      const { naturalWidth, naturalHeight } =
        imageCanvasRef.current.attrs.image;
      const aspect = naturalWidth / naturalHeight;
      let width = 0;
      let height = 0;
      if (naturalWidth >= naturalHeight) {
        width = naturalWidth > maxHeight ? maxHeight : naturalWidth;
        height = width / aspect;
      } else {
        height = naturalHeight > maxHeight ? maxHeight : naturalHeight;
        width = height * aspect;
      }

      stageRef.current.width(width);
      stageRef.current.height(height);
      stageRef.current.opacity(1);
      imageCanvasRef.current.scaleX(width / naturalWidth);
      imageCanvasRef.current.scaleY(height / naturalHeight);
      setInitialWidth(width);
      setInitialAspect(aspect);
      setCurrentStage({ width, height });
    }
  }, [imageCanvas, imageCanvasRef, maxHeight]);

  useEffect(() => {
    const updateStage = () => {
      if (objectDetectingSelector.indexTool === 0) {
        stageRef.current.width(0);
        stageRef.current.height(0);
        stageRef.current.opacity(0);
        return 0;
      }
      if (currentStage && objectDetectingSelector.indexTool !== 0) {
        stageRef.current.width(currentStage.width);
        stageRef.current.height(currentStage.height);
        stageRef.current.opacity(1);
      }
    };

    updateStage();
  }, [objectDetectingSelector.indexTool, currentStage]);

  useEffect(() => {
    if (
      objectDetectingSelector.applyCrop &&
      objectDetectingSelector.crop &&
      imageCanvasRef.current
    ) {
      applyCrop();
      dispatch({
        type: Types.APPLY_CROP,
        payload: { objectDetecting: { applyCrop: false } },
      });
      dispatch({
        type: Types.SET_IMAGE_TOOL,
        payload: { objectDetecting: { indexTool: null! } },
      });
    }
  }, [objectDetectingSelector, applyCrop, dispatch]);

  useEffect(() => {
    if (objectDetectingSelector.currentObject) {
      const ref = objectRef.current.find(
        (o) => o.attrs.name === objectDetectingSelector.currentObject.name
      ) as Konva.Rect;
      ref.stroke("yellow");
    }
    if (!objectDetectingSelector.currentObject) {
      objectRef.current.forEach((e) => e.stroke("red"));
    }
  }, [objectDetectingSelector.currentObject]);

  useEffect(() => {
    if (
      objectDetectingSelector.isDelete &&
      objectDetectingSelector.currentObject
    ) {
      setRectList(
        rectList.filter(
          (r) => r.name !== objectDetectingSelector.currentObject.name
        )
      );
      objectRef.current = objectRef.current.filter(
        (o) => o.attrs.name !== objectDetectingSelector.currentObject.name
      );
      dispatch({
        type: Types.SET_CURRENT_OBJECT,
        payload: { objectDetecting: { currentObject: null! } },
      });
      dispatch({
        type: Types.IS_DELETE_OBJECT,
        payload: { objectDetecting: { isDelete: false } },
      });
      objectRef.current.forEach((e) => e.stroke("red"));
    }
  }, [
    objectDetectingSelector.isDelete,
    objectDetectingSelector.currentObject,
    dispatch,
    rectList,
  ]);

  const zoomStart = () => {
    setIsZoom(true);
    copyImageProperty();
    let sideOfSquare =
      currentStage.width >= currentStage.height
        ? currentStage.height
        : currentStage.width;
    sideOfSquare = sideOfSquare / 3;
    sideOfSquare = sideOfSquare < 100 ? 100 : sideOfSquare;

    let { x, y } = stageRef.current.getPointerPosition() as Vector2d;

    const zoomPosition = getPositionZoom({
      x,
      y,
      width: currentStage.width,
      height: currentStage.height,
      xStage: stageRef.current.x(),
      yStage: stageRef.current.y(),
      scaleX: stageRef.current.scaleX(),
      scaleY: stageRef.current.scaleY(),
      sideOfSquare,
    });
    x = (x - stageRef.current.x()) / stageRef.current.scaleX();
    y = (y - stageRef.current.y()) / stageRef.current.scaleY();
    const xImage = x / zoomRef.current.scaleX();
    const yImage = y / zoomRef.current.scaleY();

    zoomRef.current.crop({
      x: xImage - zoomScope / 2,
      y: yImage - zoomScope / 2,
      width: zoomScope,
      height: zoomScope,
    });
    zoomRef.current.position(zoomPosition);

    zoomRef.current.width(sideOfSquare);
    zoomRef.current.height(sideOfSquare);
    zoomRef.current.scaleX(1 / stageRef.current.scaleX());
    zoomRef.current.scaleY(1 / stageRef.current.scaleY());
  };

  const zoomTouch = () => {
    if (!isZoom) return;
    copyImageProperty();
    let sideOfSquare =
      currentStage.width >= currentStage.height
        ? currentStage.height
        : currentStage.width;
    sideOfSquare = sideOfSquare / 3;
    sideOfSquare = sideOfSquare < 100 ? 100 : sideOfSquare;

    let { x, y } = stageRef.current.getPointerPosition() as Vector2d;

    const zoomPosition = getPositionZoom({
      x,
      y,
      width: currentStage.width,
      height: currentStage.height,
      xStage: stageRef.current.x(),
      yStage: stageRef.current.y(),
      scaleX: stageRef.current.scaleX(),
      scaleY: stageRef.current.scaleY(),
      sideOfSquare,
    });
    x = (x - stageRef.current.x()) / stageRef.current.scaleX();
    y = (y - stageRef.current.y()) / stageRef.current.scaleY();
    const xImage = x / zoomRef.current.scaleX();
    const yImage = y / zoomRef.current.scaleY();

    zoomRef.current.crop({
      x: xImage - zoomScope / 2,
      y: yImage - zoomScope / 2,
      width: zoomScope,
      height: zoomScope,
    });
    zoomRef.current.position(zoomPosition);
    zoomRef.current.width(sideOfSquare);
    zoomRef.current.height(sideOfSquare);
    zoomRef.current.scaleX(1 / stageRef.current.scaleX());
    zoomRef.current.scaleY(1 / stageRef.current.scaleY());
  };

  const outZoomTouch = () => {
    zoomRef.current.x(0);
    zoomRef.current.y(0);
    zoomRef.current.width(0);
    zoomRef.current.height(0);
    setIsZoom(false);
  };

  const annotationsToDraw = [...annotations, ...newAnnotation];
  return (
    <HStack width="100%" h="100vh">
      <ImageToolbox />
      <VStack width="100%" h="100vh">
        {objectDetectingSelector.indexTool === 0 ? <CropOption /> : null}
        {objectDetectingSelector.indexTool === 4 &&
        objectDetectingSelector.currentObject ? (
          <ObjectOption />
        ) : null}
        <Center
          width="100%"
          h="100vh"
          _hover={{
            cursor:
              objectDetectingSelector.indexTool === 1
                ? "grab"
                : objectDetectingSelector.indexTool === 2
                ? "zoom-in"
                : "",
          }}
        >
          <Stage
            ref={stageRef}
            onMouseDown={
              objectDetectingSelector.indexTool === 3
                ? startDraw
                : !objectDetectingSelector.indexTool
                ? zoomStart
                : () => true
            }
            onTouchStart={
              objectDetectingSelector.indexTool === 3
                ? startDraw
                : !objectDetectingSelector.indexTool
                ? zoomStart
                : () => true
            }
            onTouchMove={
              objectDetectingSelector.indexTool === 2
                ? onTouchMoveZoom
                : objectDetectingSelector.indexTool === 3
                ? drawing
                : !objectDetectingSelector.indexTool
                ? zoomTouch
                : () => true
            }
            onMouseMove={
              objectDetectingSelector.indexTool === 3
                ? drawing
                : !objectDetectingSelector.indexTool
                ? zoomTouch
                : () => true
            }
            onTouchEnd={
              objectDetectingSelector.indexTool === 2
                ? () => {
                    setLastDist(0);
                    setLastCenter(null!);
                  }
                : objectDetectingSelector.indexTool === 3
                ? stopDraw
                : outZoomTouch
            }
            onClick={
              objectDetectingSelector.indexTool === 2
                ? () => {
                    setLastDist(0);
                    setLastCenter(null!);
                  }
                : objectDetectingSelector.indexTool === 3
                ? stopDraw
                : () => true
            }
            onMouseUp={
              objectDetectingSelector.indexTool === 2
                ? () => {
                    setLastDist(0);
                    setLastCenter(null!);
                  }
                : outZoomTouch
            }
            onWheel={onWheel}
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px",
            }}
          >
            <Layer x={0} y={0}>
              <Image
                image={imageCanvas}
                ref={imageCanvasRef}
                draggable={objectDetectingSelector.indexTool === 1}
                dragBoundFunc={(pos) => {
                  let { x, y } = pos;
                  x = stageRef.current.scaleX() === 1 ? 0 : x;
                  y = stageRef.current.scaleY() === 1 ? 0 : y;
                  return { x, y };
                }}
              />
              {rectList.map((rect, index) => (
                <Rect
                  {...rect}
                  stroke="red"
                  ref={(e) => {
                    if (
                      e &&
                      e.attrs.name &&
                      !objectRef.current.some((o) => o.attrs.name === rect.name)
                    ) {
                      objectRef.current.push(e);
                    }
                  }}
                  key={index}
                  onMouseDown={() =>
                    dispatch({
                      type: Types.SET_CURRENT_OBJECT,
                      payload: { objectDetecting: { currentObject: rect } },
                    })
                  }
                  onTouchStart={() =>
                    dispatch({
                      type: Types.SET_CURRENT_OBJECT,
                      payload: { objectDetecting: { currentObject: rect } },
                    })
                  }
                />
              ))}
              {annotationsToDraw.map((rect, index) => (
                <Rect {...rect} stroke="red" key={index} />
              ))}
              <Image image={undefined} x={0} y={0} ref={zoomRef} />
            </Layer>
          </Stage>
          {objectDetectingSelector.indexTool === 0 &&
          initialAspect &&
          initialWidth &&
          image ? (
            <ObjectImage
              image={image}
              width={initialWidth}
              height={initialWidth / initialAspect}
            />
          ) : null}
        </Center>
      </VStack>
    </HStack>
  );
}
