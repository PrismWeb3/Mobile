import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@styles";
import { Ionicons } from "@expo/vector-icons";
import { NavigationElement, Profile } from "@types";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

interface Props {
  profile: Profile;
  navigation: StackNavigationProp<ParamListBase>;
}

export function ProfileHeader(props: Props): JSX.Element {
  return (
    <View style={[styles.container, globalStyles.containerColorSecondary]}>
      <TouchableOpacity
        activeOpacity={0.7}
      >
        <Ionicons
          name="notifications"
          size={24}
          color={globalStyles.fontColorPrimary.color}
        />
      </TouchableOpacity>

      <Text style={[styles.username, globalStyles.fontColorPrimary]}>
        @{props.profile.username}
      </Text>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          props.navigation.push(NavigationElement.ProfileSettingsScreen)}
      >
        <Ionicons
          name="settings"
          size={24}
          color={globalStyles.fontColorPrimary.color}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      height: 46,
      flexDirection: "row",
      paddingHorizontal: 12,
      justifyContent: "space-between",
      alignItems: "center",
    },
    username: {
      fontWeight: "700",
      fontSize: 18,
    },
  },
);
