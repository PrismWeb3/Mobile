import * as React from "react";
import {
  FlexAlignType,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { LinearGradient, LinearGradientPoint } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

interface Props {
  style?: StyleProp<ViewStyle>;
  text: string;
  fontSize: number;
  fontFamily?: string;
  colors: string[];
  start?: LinearGradientPoint | null;
  end?: LinearGradientPoint | null;
  locations?: number[] | null;
  borderRadius?: number;
  alignTextHor?: FlexAlignType;
  alignTextVer?: "flex-start" | "flex-end" | "center";
}

export function GradientText(props: Props) {
  return (
    <MaskedView
      style={[styles.maskedView, props.style]}
      maskElement={
        <View
          style={[styles.textContainer, {
            justifyContent: props.alignTextVer,
            alignItems: props.alignTextHor,
          }]}
        >
          <Text
            style={{
              fontSize: props.fontSize,
              fontFamily: props.fontFamily,
            }}
          >
            {props.text}
          </Text>
        </View>
      }
    >
      <LinearGradient
        colors={props.colors}
        style={styles.backgroundGradient}
        start={props.start}
        end={props.end}
        locations={props.locations}
      />
    </MaskedView>
  );
}

const styles = StyleSheet.create(
  {
    maskedView: {
      width: "100%",
      height: "100%",
      backgroundColor: "red",
    },
    textContainer: {
      flex: 1,
    },
    backgroundGradient: {
      height: "100%",
      width: "100%",
    },
  },
);
