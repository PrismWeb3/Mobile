import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@styles";
import { DefaultScreenHeader } from "@components";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { FlatList } from "react-native-gesture-handler";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { NavigationElement } from "@types";

interface Setting {
  icon: JSX.Element;
  text: string;
  action: () => void;
}

interface Props {
  navigation: StackNavigationProp<ParamListBase>;
}

export function ProfileSettingsScreen(props: Props): JSX.Element {
  const iconColor = globalStyles.fontColorPrimary.color;

  const settings: Setting[] = [
    {
      icon: <FontAwesome5 name="user-edit" size={18} color={iconColor} />,
      text: "Edit Profile",
      action: () => props.navigation.push(NavigationElement.EditProfileScreen),
    },
    {
      icon: (
        <MaterialIcons name="important-devices" size={23} color={iconColor} />
      ),
      text: "Add Device",
      action: () => props.navigation.push(NavigationElement.AddDeviceScreen),
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="account-multiple-plus"
          size={23}
          color={iconColor}
        />
      ),
      text: "Accounts",
      action: () => props.navigation.push(NavigationElement.AccountsScreen),
    },
  ];

  const renderItem = ({ item }: { item: Setting }) => (
    <TouchableOpacity
      style={[styles.settingContainer]}
      activeOpacity={0.7}
      onPress={item.action}
    >
      {item.icon}
      <Text style={[styles.settingText, globalStyles.fontColorPrimary]}>
        {item.text}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={18}
        color={globalStyles.fontColorSecondary.color}
      />
    </TouchableOpacity>
  );

  const keyExtractor = (_item: Setting, index: number) => String(index);

  return (
    <View style={[styles.container, globalStyles.containerColorMain]}>
      <DefaultScreenHeader
        title={"Settings"}
        back={true}
        navigation={props.navigation}
      />

      <FlatList
        data={settings}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        bounces={false}
      />
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    settingContainer: {
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      borderBottomWidth: 1,
      borderColor: "#1f1c24",
    },
    settingText: {
      fontSize: 16,
      marginLeft: 16,
      marginRight: "auto",
    },
  },
);
