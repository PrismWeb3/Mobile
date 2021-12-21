import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, Dimensions } from 'react-native';
import { globalStyles } from '@styles';
import { AntDesign } from '@expo/vector-icons';
import { Message, Contact } from '@types';

interface Props {
    style?: StyleProp<ViewStyle>;
    headerColor: string;
    contact: Contact;
    message: Message;
    showDelete?: boolean;
    onDelete?: () => void;
}

export function ChatReplyMessage(props: Props): JSX.Element {
    return <View style={[styles.replyContainer, props.style]}>
        <View style={[styles.replyLine, { backgroundColor: props.headerColor }]} />

        <View style={styles.textWrapper}>
            <Text style={[styles.replyUsername, { color: props.headerColor }]}
            >{props.message.isSender ? 'HPaulson' : props.contact.username}</Text>

            <Text
                style={[styles.replyText, globalStyles.fontColorPrimary]}
                numberOfLines={1}
            >{props.message.text}</Text>
        </View>

        {
            props.showDelete &&
            <AntDesign
                style={styles.replyDelete}
                name='close' size={24} color={globalStyles.fontColorAccent.color}
                onPress={() => props.onDelete ? props.onDelete() : undefined}
            />
        }
    </View>;
}

const styles = StyleSheet.create(
    {
        replyContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            width: '100%',
            minWidth: Dimensions.get('window').width * 0.5
        },
        replyLine: {
            width: 2,
            height: 30,
            marginRight: 8
        },
        textWrapper: {
            flex: 1
        },
        replyUsername: {
            fontSize: 14,
            fontWeight: '700'
        },
        replyText: {
            fontSize: 13,
            maxWidth: '90%'
        },
        replyDelete: {
            marginLeft: 'auto'
        },
    }
);
