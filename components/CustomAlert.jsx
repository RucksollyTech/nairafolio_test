import React from 'react';
import { Alert } from 'react-native';

const showAlert = () => {
  Alert.alert(
    "Custom Alert Title", // Title
    "This is a customizable alert message.", // Message
    [
      {
        text: "Close",
        onPress: () => console.log("Close Pressed"),
        style: "cancel", // Makes the button stand out as a "Cancel"
      },
      {
        text: "Proceed",
        onPress: () => console.log("Proceed Pressed"),
      },
    ],
    { cancelable: true } // Allows dismissing the alert by tapping outside
  );
};

export default showAlert;
