import React, { useEffect, useState } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Contact, NavigationElement } from '@types';
import { ParamListBase, RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyles } from '../../styles';
import { ChatHeader } from './components/chatHeader.component';
import { ChatInput } from './components/chatInput.component';
import { ChatMessages } from './components/chatMessages.component';
import { ChatMediaModal } from './components/chatMediaModal.component';

type RouteParams = {
    [NavigationElement.LoginScannerScreen]: {
        contact: string
    }
};

interface Props {
    route: RouteProp<RouteParams, NavigationElement.LoginScannerScreen>;
    navigation: StackNavigationProp<ParamListBase>;
}

export function ChatScreen(props: Props): JSX.Element {

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const contact: Contact = JSON.parse(props.route.params.contact);
    contact.lastMessageTime = new Date(contact.lastMessageTime);

    useEffect(
        () => {
            const keyboardShowSubscription = Keyboard.addListener('keyboardWillShow', (event) => setKeyboardHeight(event.endCoordinates.height - 40));
            const keyboardHideSubscription = Keyboard.addListener('keyboardWillHide', () => setKeyboardHeight(0));

            return () => {
                keyboardShowSubscription.remove();
                keyboardHideSubscription.remove();
            };
        },
        []
    );

    return <View style={[styles.container, globalStyles.containerColorMain]}>
        <ChatHeader
            contact={contact}
            navigation={props.navigation}
        />

        <View
            style={[styles.container, { marginBottom: keyboardHeight }]}
        >
            <ChatMessages contact={contact} />
            <ChatInput contact={contact} />
        </View>

        <ChatMediaModal />
    </View>;
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        }
    }
);
