import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

const CustomModalAlert = ({children, isVisible, onClose, title, className, body,showDefault=true, defaultText }) => {
    return (
        <Modal isVisible={isVisible} className={className ?? ""} onBackdropPress={showDefault ? onClose : ()=>console.log("")} style={styles.modal}>
            <View style={styles.container}>
                <View className="px-5 pt-5 pb-2">
                    {title && (
                        <Text style={styles.title} className="text-white text-center">
                            {title}
                        </Text>
                    )}
                    {body && (
                        <Text style={styles.message} className="text-white">
                            {body}
                        </Text>
                    )}
                </View>
                {children}
                {showDefault && (
                    <TouchableOpacity className="border-t border-[#4e4e4e]" style={styles.buttonSecondary} onPress={onClose}>
                        <Text className="font-psemibold text-lg text-blue-500">{defaultText ?? "Cancel"}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    backgroundColor: "#00000090",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonPrimary: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonTextPrimary: {
    color: "#fff",
    fontSize: 16,
  },
  buttonSecondary: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
  }
});

export default CustomModalAlert;
