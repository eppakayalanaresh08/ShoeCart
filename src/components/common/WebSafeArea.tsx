import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const WebSafeArea: React.FC<SafeContainerProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
