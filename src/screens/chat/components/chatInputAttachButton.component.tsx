import React from 'react';
import { Keyboard, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '@styles';
import { ActionSheetOption, ActionSheetEvent, ChatMediaModalEvent } from '@types';
import { eventManager } from '@services/eventManager';
import { FontAwesome } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { wait } from '@services';
import * as ImagePicker from 'expo-image-picker';
import { chatEventManager } from '../chatEventManager';

export function ChatInputAttachButton(): JSX.Element {

    const onPress = async () => {
        Keyboard.dismiss();
        await wait(250);

        const options: ActionSheetOption[] = [
            {
                icon: <SimpleLineIcons name='camera' size={24} color={globalStyles.fontColorAccent.color} />,
                text: 'Camera',
                callback: launchCamera
            },
            {
                icon: <FontAwesome name='photo' size={22} color={globalStyles.fontColorAccent.color} />,
                text: 'Photo Library',
                callback: launchPhotoLibrary
            }
        ];

        const actionSheetEvent: ActionSheetEvent = {
            options
        };

        eventManager.actionSheet.next(actionSheetEvent);
    };

    const launchCamera = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('In order to be able to capture one of your images and attach it to your comment, we need access to your camera.');
                return;
            }
        }

        await wait(250);
        const result = await ImagePicker.launchCameraAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: undefined
            }
        );

        if (!result.cancelled && result.type === 'image') {
            const uri = result.uri;
            chooseImage(uri);
        }
    };

    const launchPhotoLibrary = async () => {
        await wait(250);

        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('In order to be able to choose one of your images and attach it to your comment, we need access to your photos.');
                return;
            }
        }

        const result = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: undefined
            }
        );

        if (!result.cancelled && result.type === 'image') {
            const uri = result.uri;
            chooseImage(uri);
        }
    };

    const chooseImage = (uri: string) => {
        const mediaEvent: ChatMediaModalEvent = {
            uri,
            showActionBar: true,
            showSaveButton: false
        };
        chatEventManager.mediaModal.next(mediaEvent);
    };

    return <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={onPress}
    >
        <Ionicons name='add' size={34} color={globalStyles.fontColorAccent.color} />
    </TouchableOpacity>;
}

const styles = StyleSheet.create(
    {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            height: 40
        }
    }
);
