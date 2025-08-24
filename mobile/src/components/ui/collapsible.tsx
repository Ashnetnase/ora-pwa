import * as React from "react";
import { View, Animated, ViewStyle } from "react-native";

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface CollapsibleTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
}

interface CollapsibleContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CollapsibleContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

function Collapsible({ open = false, onOpenChange, children }: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const setOpen = React.useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  return (
    <CollapsibleContext.Provider value={{ open: isOpen, setOpen }}>
      <View>{children}</View>
    </CollapsibleContext.Provider>
  );
}

function CollapsibleTrigger({ asChild, children }: CollapsibleTriggerProps) {
  const { open, setOpen } = React.useContext(CollapsibleContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onPress: () => setOpen(!open),
      ...children.props,
    });
  }

  return <View>{children}</View>;
}

function CollapsibleContent({ children, style }: CollapsibleContentProps) {
  const { open } = React.useContext(CollapsibleContext);
  const [height] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(height, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [open, height]);

  if (!open) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          overflow: 'hidden',
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };