import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { stackConfig } from "./stackNavigationConfig";
import { FeedScreen } from "@screens";
import { NavigationElement } from "@types";

const Stack = createStackNavigator();

export function FeedStack(): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        ...stackConfig,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name={NavigationElement.FeedScreen}
        component={FeedScreen}
      />
    </Stack.Navigator>
  );
}
