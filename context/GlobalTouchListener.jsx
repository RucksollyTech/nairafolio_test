// GlobalTouchListener.js
import React from 'react';
import { View } from 'react-native';
import { TapGestureHandler, State } from 'react-native-gesture-handler';

const GlobalTouchListener = ({ onTouch, children }) => {
  const handleStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onTouch();
    }
  };

  return (
    <TapGestureHandler onHandlerStateChange={handleStateChange}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </TapGestureHandler>
  );
};

export default GlobalTouchListener;
