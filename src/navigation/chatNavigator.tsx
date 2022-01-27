import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { stackConfig } from "./stackNavigationConfig";
import { ChatListScreen } from "@screens";
import { NavigationElement } from "@types";

const Stack = createStackNavigator();

export function ChatStack(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackConfig,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={NavigationElement.ChatListScreen}
        component={ChatListScreen}
      />
    </Stack.Navigator>
  );
}
