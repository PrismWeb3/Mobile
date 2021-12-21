import * as React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient, LinearGradientPoint } from 'expo-linear-gradient';

interface Props {
    style?: StyleProp<ViewStyle>;
    colors: string[];
    start?: LinearGradientPoint | null;
    end?: LinearGradientPoint | null;
    locations?: number[] | null;
    borderRadius?: number;
    opacity?: number;
}

export function GradientBackground(props: Props) {
    return (
        <LinearGradient
            colors={props.colors}
            style={[
                props.style, styles.backgroundGradient,
                props.borderRadius != null && { borderRadius: props.borderRadius },
                props.opacity != null && { opacity: props.opacity }
            ]}
            start={props.start}
            end={props.end}
            locations={props.locations}
        />
    );
}

const styles = StyleSheet.create(
    {

        backgroundGradient: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
        }
    }
);
