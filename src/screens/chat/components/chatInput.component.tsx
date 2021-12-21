import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { globalStyles } from '@styles';
import { chatEventManager } from '../chatEventManager';
import { Contact, Message } from '@types';
import { Ionicons } from '@expo/vector-icons';
import { ChatReplyMessage } from './chatReplyMessage.component';
import { ChatInputAttachButton } from './chatInputAttachButton.component';

interface Props {
    contact: Contact;
}

export function ChatInput(props: Props): JSX.Element {

    const textInput = useRef<TextInput>(null);
    const [value, setValue] = useState('');
    const [replyMessage, setReplyMessage] = useState<Message | undefined>();

    useEffect(
        () => {

            const replySubscription = chatEventManager.reply.subscribe(
                message => {
                    textInput.current?.focus();
                    setReplyMessage(message);
                }
            );

            return () => {
                replySubscription();
            };
        },
        []
    );

    const onSendMessage = () => {
        if (!value) {
            return;
        }

        const newMessage: Message = {
            text: value,
            isSender: true,
            time: new Date(),
            new: true,
            reply: replyMessage
        };

        chatEventManager.newMessage.next(newMessage);
        setValue('');
        setReplyMessage(undefined);
    };

    return <>
        {
            replyMessage != null &&
            <ChatReplyMessage
                style={globalStyles.containerColorSecondary}
                message={replyMessage}
                showDelete
                contact={props.contact}
                onDelete={() => setReplyMessage(undefined)}
                headerColor={globalStyles.fontColorAccent.color}
            />
        }
        <View style={[styles.container, globalStyles.containerColorSecondary]}>

            <ChatInputAttachButton />

            <TextInput
                ref={textInput}
                style={[styles.textInput, globalStyles.containerColorMain, globalStyles.fontColorPrimary, globalStyles.fontFamilyPrimary]}
                value={value}
                onChangeText={setValue}
                keyboardAppearance={'dark'}
                multiline={true}
                placeholder={'Type a message'}
                placeholderTextColor={globalStyles.fontColorSecondary.color}
            />

            <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.sendButtonContainer]}
                onPress={onSendMessage}
            >
                <Ionicons name='arrow-up-sharp' size={24} color='white' />
            </TouchableOpacity>
        </View>
    </>;
}

const styles = StyleSheet.create(
    {
        container: {
            width: '100%',
            paddingTop: 7,
            paddingBottom: 12,
            paddingHorizontal: 10,
            flexDirection: 'row',
            alignItems: 'center'
        },
        textInput: {
            borderRadius: 15,
            paddingHorizontal: 10,
            paddingVertical: 10,
            flex: 1,
            marginRight: 10,
            fontSize: 16,
            maxHeight: 75
        },
        sendButtonContainer: {
            width: 35,
            height: 35,
            backgroundColor: '#4287f5',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 25,
        }
    }
);
