import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '@styles';

export function ChatListHeader(): JSX.Element {

    return <View style={[styles.container, globalStyles.containerColorSecondary]}>
        <Text style={[styles.title, globalStyles.fontColorPrimary, globalStyles.fontFamilyPrimaryBold]}>Chats</Text>
    </View>;
}

const styles = StyleSheet.create(
    {
        container: {
            height: 44,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        },
        title: {
            fontSize: 18,
            fontWeight: '700'
        }
    }
);
