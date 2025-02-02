import React from 'react';
import { Alert } from 'react-native';

const showAlert = ({title,body,closeText,handleCancel,handleContinue}) => {
  Alert.alert(
    title, // Title
    body, // Message
    [
      {
        text: closeText,
        onPress: () => handleCancel(),
        style: "cancel", // Makes the button stand out as a "Cancel"
      },
      {
        text: "Proceed",
        onPress: () => handleContinue(),
      },
    ],
    { cancelable: true } // Allows dismissing the alert by tapping outside
  );
};

export default showAlert;
