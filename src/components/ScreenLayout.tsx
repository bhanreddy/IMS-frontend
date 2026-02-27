import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ScreenLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {children}
      </View>
    </SafeAreaProvider>
  );
};

export default ScreenLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
