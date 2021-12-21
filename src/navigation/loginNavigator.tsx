import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScannerScreen, SignUpScreen, StartScreen } from '@screens';
import { stackConfig } from './stackNavigationConfig';
import { NavigationElement } from '@types';

const Stack = createStackNavigator();

export function LoginStack() {
    return (
        <Stack.Navigator
            screenOptions={
                {
                    ...stackConfig,
                    headerShown: false
                }
            }
        >
            <Stack.Screen
                name={NavigationElement.StartScreen}
                component={StartScreen}
            />

            <Stack.Screen
                name={NavigationElement.SignUpScreen}
                component={SignUpScreen}
            />

            <Stack.Screen
                name={NavigationElement.LoginScannerScreen}
                component={LoginScannerScreen}
            />
        </Stack.Navigator >
    );
}
