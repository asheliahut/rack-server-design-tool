import { useDrag, useDrop } from "react-dnd";
import { RackComponent, RackPosition } from "@/types/rack";
import { DragItem } from "@/types/design";

export const useDragComponent = (
  component: RackComponent,
  sourcePosition?: RackPosition
) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "component",
    item: (): DragItem => ({
      type: "component",
      component,
      sourcePosition,
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // Handle failed drop - component snaps back to original position
      }
    },
  });

  return {
    isDragging,
    drag,
    preview,
  };
};

export const useDropTarget = (
  onDrop: (item: DragItem, position: RackPosition) => void,
  canDrop?: (item: DragItem, position: RackPosition) => boolean
) => {
  const [{ isOver, canDropHere }, drop] = useDrop({
    accept: "component",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropHere: monitor.canDrop(),
    }),
    canDrop: (item: DragItem, monitor) => {
      if (!canDrop) return true;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return false;

      // Convert client offset to rack position
      const position: RackPosition = {
        x: clientOffset.x,
        y: clientOffset.y,
        rackUnit: Math.floor(clientOffset.y / 44) + 1, // 44px per rack unit
      };

      return canDrop(item, position);
    },
    drop: (item: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const position: RackPosition = {
        x: clientOffset.x,
        y: clientOffset.y,
        rackUnit: Math.floor(clientOffset.y / 44) + 1,
      };

      onDrop(item, position);
    },
  });

  return {
    isOver,
    canDropHere,
    drop,
  };
};

export const useDragAndDrop = (
  component: RackComponent,
  sourcePosition?: RackPosition,
  onDrop?: (item: DragItem, position: RackPosition) => void,
  canDrop?: (item: DragItem, position: RackPosition) => boolean
) => {
  const dragProps = useDragComponent(component, sourcePosition);
  const dropProps = onDrop ? useDropTarget(onDrop, canDrop) : null;

  return {
    ...dragProps,
    ...dropProps,
  };
};
