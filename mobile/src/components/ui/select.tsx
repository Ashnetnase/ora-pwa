import * as React from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => {},
});

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps {
  style?: ViewStyle;
  children: React.ReactNode;
}

function SelectTrigger({ style, children }: SelectTriggerProps) {
  const { setOpen } = React.useContext(SelectContext);

  return (
    <TouchableOpacity
      style={[styles.trigger, style]}
      onPress={() => setOpen(true)}
      activeOpacity={0.7}
    >
      <View style={styles.triggerContent}>
        {children}
      </View>
      <Ionicons name="chevron-down" size={16} color="#6B7280" />
    </TouchableOpacity>
  );
}

interface SelectValueProps {
  placeholder?: string;
  style?: TextStyle;
}

function SelectValue({ placeholder, style }: SelectValueProps) {
  const { value } = React.useContext(SelectContext);

  return (
    <Text style={[styles.value, style]}>
      {value || placeholder}
    </Text>
  );
}

interface SelectContentProps {
  children: React.ReactNode;
}

function SelectContent({ children }: SelectContentProps) {
  const { open, setOpen } = React.useContext(SelectContext);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setOpen(false)}
        activeOpacity={1}
      >
        <View style={styles.content}>
          {children}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

function SelectItem({ value, children, style }: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  const handlePress = () => {
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelected, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
        {children}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={16} color="#2563EB" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  triggerContent: {
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#111827',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 20,
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemSelected: {
    backgroundColor: '#EFF6FF',
  },
  itemText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  itemTextSelected: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };