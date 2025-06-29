import { useDrag, useDrop } from "react-dnd";
import { RackComponent, RackPosition } from "@/types/rack";
import { DragItem } from "@/types/design";

export const useDragComponent = (
  component: RackComponent,
  sourcePosition?: RackPosition
) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: "component",
    item: (): DragItem => {
      console.log("Drag started for component:", component.name);
      return {
        type: "component",
        component,
        sourcePosition,
      };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (_item, monitor) => {
      console.log("Drag ended, didDrop:", monitor.didDrop());
      if (!monitor.didDrop()) {
        console.log("Drop failed - component snaps back to original position");
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
  const [{ isOver, canDropHere }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDropHere: boolean }
  >({
    accept: "component",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDropHere: monitor.canDrop(),
    }),
    canDrop: (_item, monitor) => {
      if (!canDrop) return true;

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return false;

      // This will be handled by the specific drop target components
      // For now, always return true and let the RackContainer handle validation
      return true;
    },
    drop: (item, monitor) => {
      // Only handle drops if not already handled by nested drop targets
      if (monitor.didDrop()) {
        return;
      }

      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      // Default position - will be overridden by specific drop targets
      const position: RackPosition = {
        x: clientOffset.x,
        y: clientOffset.y,
        rackUnit: 1,
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
