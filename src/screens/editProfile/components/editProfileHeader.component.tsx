import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@styles";
import { Ionicons } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface Props {
  navigation?: StackNavigationProp<ParamListBase>;
  save: () => void;
}

export function EditProfileHeader(props: Props): JSX.Element {
  return (
    <View style={[styles.container, globalStyles.containerColorSecondary]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => props.navigation?.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <Text style={[styles.title, globalStyles.fontColorPrimary]}>
        Edit Profile
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.save}
      >
        <Text style={[styles.saveText, globalStyles.fontColorAccent]}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flexDirection: "row",
      height: 48,
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 12,
    },
    title: {
      fontWeight: "700",
      fontSize: 18,
    },
    saveText: {
      fontSize: 17,
    },
  },
);
