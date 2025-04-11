import React from 'react';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SwipeableNotification = ({ children, onDelete }: any) => {
  const renderRightActions = () => (
    <RectButton style={styles.deleteButton} onPress={onDelete}>
      <MaterialCommunityIcons name="delete" size={24} color="white" />
    </RectButton>
  );

  return (
    <Swipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
    >
      {children}
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default SwipeableNotification;