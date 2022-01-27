import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@styles";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  back: boolean;
  title: string;
  navigation?: StackNavigationProp<ParamListBase>;
}

export function DefaultScreenHeader(props: Props): JSX.Element {
  return (
    <View style={[styles.container, globalStyles.containerColorSecondary]}>
      {props.back &&
        (
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.7}
            onPress={() => props.navigation?.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="white" />
          </TouchableOpacity>
        )}

      <Text style={[styles.title, globalStyles.fontColorPrimary]}>
        {props.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flexDirection: "row",
      height: 48,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontWeight: "700",
      fontSize: 18,
    },
    backButton: {
      position: "absolute",
      left: 12,
    },
  },
);
