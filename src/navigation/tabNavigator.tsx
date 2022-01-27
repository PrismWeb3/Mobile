import React, { useEffect, useState } from "react";
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationElement } from "@types";
import { ChatStack } from "./chatNavigator";
import { ProfileStack } from "./profileNavigator";
import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { globalStyles } from "@styles";
import { FeedStack } from "./feedNavigator";

const Tab = createBottomTabNavigator();

function TabBar({ props }: { props: BottomTabBarProps }): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const state = props.state;
  const routes = state.routeNames;
  const tabScreenNames = routes.map((route) => route);
  const { index } = state;

  const [selectedTab, setSelectedTab] = useState(tabScreenNames[index]);

  useEffect(() => {
    setSelectedTab(tabScreenNames[index]);
  }, [index]);

  const getTabElement = (route: string): JSX.Element => {
    const selected = route === selectedTab;
    const iconColor = selected ? globalStyles.fontColorAccent.color : "white";

    let icon: JSX.Element = <></>;
    switch (route) {
      case NavigationElement.FeedStack:
        icon = <Entypo name="network" size={24} color={iconColor} />;
        break;
      case NavigationElement.ChatStack:
        icon = (
          <Ionicons
            name="chatbubbles-sharp"
            size={28}
            color={iconColor}
          />
        );
        break;
      case NavigationElement.ProfileStack:
        icon = (
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={28}
            color={iconColor}
          />
        );
        break;
    }

    return (
      <TouchableOpacity
        style={styles.tabElementContainer}
        key={route}
        activeOpacity={0.5}
        onPress={() => navigation.navigate(route)}
      >
        {icon}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={globalStyles.containerColorSecondary}>
      <View style={styles.tabsContainer}>
        {routes.map((p_route) => getTabElement(p_route))}
      </View>
    </SafeAreaView>
  );
}

export function TabNavigator() {
  return (
    <Tab.Navigator
      sceneContainerStyle={globalStyles.containerColorMain}
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar props={props} />}
    >
      <Tab.Screen name={NavigationElement.ChatStack} component={ChatStack} />
      {/* <Tab.Screen name={NavigationElement.FeedStack} component={FeedStack} /> */}
      <Tab.Screen
        name={NavigationElement.ProfileStack}
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create(
  {
    tabsContainer: {
      height: 45,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    tabElementContainer: {
      width: 30,
      height: 35,
      alignItems: "center",
      justifyContent: "center",
    },
  },
);
