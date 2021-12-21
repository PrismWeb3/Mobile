import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Image, Keyboard, StyleSheet, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { chatEventManager } from '../chatEventManager';
import { Feather, Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { globalStyles } from '@styles';
import { Message } from '@types';
import * as MediaLibrary from 'expo-media-library';

export function ChatMediaModal(): JSX.Element {

    const [visible, setVisible] = useState(false);
    const [uri, setUri] = useState('');
    const [imageWidth, setImageWidth] = useState(0);
    const [imageHeight, setImageHeight] = useState(0);
    const [caption, setCaption] = useState('');
    const [showActionBar, setShowActionBar] = useState(false);
    const [showSaveButton, setShowSaveButton] = useState(false);

    const keyboardAnimation = useRef(new Animated.Value(0)).current;

    useEffect(
        () => {
            const subscription = chatEventManager.mediaModal.subscribe(
                event => {
                    setUri(event.uri);
                    setShowActionBar(event.showActionBar);
                    setShowSaveButton(event.showSaveButton);

                    Image.getSize(
                        event.uri,
                        (width: number, height: number) => {
                            const windowsWidth = Dimensions.get('window').width;
                            const ratio = windowsWidth / width;
                            setImageWidth(windowsWidth);
                            setImageHeight(ratio * height);
                            setVisible(true);
                        }
                    );
                }
            );

            const keyboardShowSubscription = Keyboard.addListener(
                'keyboardWillShow',
                (event) => Animated.timing(
                    keyboardAnimation,
                    {
                        toValue: -event.endCoordinates.height,
                        duration: 200,
                        useNativeDriver: true
                    }
                ).start()
            );

            const keyboardHideSubscription = Keyboard.addListener(
                'keyboardWillHide',
                () => Animated.timing(
                    keyboardAnimation,
                    {
                        toValue: 0,
                        duration: 200,
                        useNativeDriver: true
                    }
                ).start()
            );

            return () => {
                subscription();
                keyboardShowSubscription.remove();
                keyboardHideSubscription.remove();
            };
        },
        []
    );

    const close = () => {
        setVisible(false);
    };

    const sendMedia = () => {
        const newMessage: Message = {
            text: caption,
            media: {
                uri,
                width: imageWidth,
                height: imageHeight
            },
            isSender: true,
            time: new Date(),
            new: true
        };

        chatEventManager.newMessage.next(newMessage);
        setCaption('');
        keyboardAnimation.setValue(0);
        close();
    };

    const saveMedia = async (): Promise<void> => {
        try {
            let permission = await MediaLibrary.getPermissionsAsync();
            if (!permission.granted) {
                permission = await MediaLibrary.requestPermissionsAsync();

                if (!permission.granted) {
                    return;
                }
            }

            await MediaLibrary.saveToLibraryAsync(uri);

            Alert.alert('Success', 'Image saved to your library');
        } catch {
        }
    };

    if (!visible) {
        return <></>;
    }

    return <Modal
        animationIn={'fadeInUp'}
        animationOut={'fadeInDown'}
        swipeDirection='down'
        animationOutTiming={500}
        onSwipeComplete={close}
        onBackdropPress={close}
        onBackButtonPress={close}
        isVisible={true}
        style={styles.container}>

        <Animated.ScrollView
            style={{ transform: [{ translateY: keyboardAnimation }] }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={'handled'}
        >
            <Image
                style={{ width: imageWidth, height: imageHeight, }}
                source={{ uri }}
            />

            {
                showSaveButton &&
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={saveMedia}
                >
                    <Feather name='download' size={28} color='white' />
                </TouchableOpacity>
            }

            {
                showActionBar &&
                <View style={[styles.actionBarContainer]}>
                    <TextInput
                        style={[styles.textInput, globalStyles.fontColorPrimary]}
                        value={caption}
                        onChangeText={setCaption}
                        placeholder={'Write caption...'}
                        placeholderTextColor={globalStyles.fontColorSecondary.color}
                    />

                    <TouchableOpacity
                        activeOpacity={0.7}
                        style={[styles.sendButtonContainer]}
                        onPress={sendMedia}
                    >
                        <Ionicons name='arrow-up-sharp' size={24} color='white' />
                    </TouchableOpacity>
                </View>
            }
        </Animated.ScrollView>
    </Modal>;
}

const styles = StyleSheet.create(
    {
        container: {
            backgroundColor: 'black',
            marginLeft: 0,
            marginRight: 0
        },
        scrollContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        },
        actionBarContainer: {
            position: 'absolute',
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            bottom: 20
        },
        textInput: {
            flex: 1,
            backgroundColor: 'black',
            padding: 10,
            marginRight: 16,
            borderRadius: 25,
            marginLeft: 10,
            borderWidth: 1,
            borderColor: '#383838'
        },
        sendButtonContainer: {
            width: 35,
            height: 35,
            backgroundColor: '#4287f5',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
        },
        saveButton: {
            position: 'absolute',
            top: '4%',
            right: '4%'
        },
    }
);
