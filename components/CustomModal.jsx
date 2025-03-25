import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

const CustomModal = ({
    visible,
    onClose,
    title = 'Modal Title',
    children,
    tw = '',
    modalStyle = {},
    contentStyle = {},
    buttonText,
}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade" // Options: "slide", "fade", "none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay} className={tw}>
                <View style={[styles.modal, modalStyle]} className="bg-white rounded-lg shadow-lg">
                    <View className="p-5">
                        <Text style={styles.title} className="text-lg font-bold text-center">
                            {title}
                        </Text>
                        <View className={`${contentStyle}`}>
                            {children}
                        </View>
                    </View>
                    <Pressable
                        className="border-t border-border dark:border-[#3B3C43] px-4 py-3 mt-2"
                        onPress={onClose}
                    >
                        <Text className="text-header text-center font-medium">{buttonText}</Text>
                    </Pressable>
                    
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    closeIcon:{
        position: 'absolute',
        top: 20,
        right: 20,
        // fontSize: 20,
        // color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    modal: {
        position: "relative",
        width: '70%',
    },
    title: {
        marginBottom: 10,
    },
    content: {
        marginVertical: 10,
    },
});

export default CustomModal;
