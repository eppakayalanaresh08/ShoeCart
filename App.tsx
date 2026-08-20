import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App() {
  return (
    <AppProvider >
      <StatusBar barStyle="light-content" backgroundColor="#5B2E8C" />
      <View style={styles.container}>
        <AppNavigator />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F8FAFC',
  },
});

export default App;
