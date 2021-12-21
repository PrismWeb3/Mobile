import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { stackConfig } from './stackNavigationConfig';
import { AccountsScreen, AddDeviceScreen, EditProfileScreen, ProfileScreen, ProfileSettingsScreen } from '@screens';
import { NavigationElement } from '@types';

const Stack = createStackNavigator();

export function ProfileStack(): JSX.Element {
    return <Stack.Navigator
        screenOptions={{
            ...stackConfig,
            headerShown: false
        }}>
        <Stack.Screen
            name={NavigationElement.ProfileScreen}
            component={ProfileScreen}
        />
        <Stack.Screen
            name={NavigationElement.ProfileSettingsScreen}
            component={ProfileSettingsScreen}
        />
        <Stack.Screen
            name={NavigationElement.EditProfileScreen}
            component={EditProfileScreen}
        />
        <Stack.Screen
            name={NavigationElement.AddDeviceScreen}
            component={AddDeviceScreen}
        />
        <Stack.Screen
            name={NavigationElement.AccountsScreen}
            component={AccountsScreen}
        />
    </Stack.Navigator>;
}
