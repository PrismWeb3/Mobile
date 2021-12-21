import React from 'react';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { globalStyles } from '@styles';
import { ParamListBase } from '@react-navigation/routers';
import { StackNavigationProp } from '@react-navigation/stack';
import { DefaultScreenHeader } from '@components';

interface Props {
    navigation: StackNavigationProp<ParamListBase>;
}

export function AddDeviceScreen(props: Props): JSX.Element {

    return <View style={[styles.container, globalStyles.containerColorMain]}>
        <DefaultScreenHeader title={'Add Device'} back={true} navigation={props.navigation} />

        <Text style={[styles.text, globalStyles.fontColorSecondary]}>Please scan the following QR code to add a new device</Text>

        <Image
            style={styles.image}
            source={{ uri: 'https://qrcodetotaal.nl/wp-content/uploads/2020/10/wat-is-qr-code.png' }}
            resizeMode={'stretch'}
            resizeMethod={'auto'}
        />
    </View>;
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1
        },
        text: {
            marginHorizontal: 12,
            marginTop: 12
        },
        image: {
            width: Dimensions.get('window').width - 24,
            height: 350,
            borderRadius: 20,
            marginLeft: 12,
            marginTop: 12
        }
    }
);
