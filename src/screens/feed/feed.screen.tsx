import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DefaultScreenHeader } from '@components';
import { globalStyles } from '@styles';

export function FeedScreen(): JSX.Element {
    return <View style={[styles.container, globalStyles.containerColorMain]}>
        <DefaultScreenHeader title={'Feed'} back={false} />
    </View>;
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        }
    }
);
