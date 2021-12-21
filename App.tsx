import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, StatusBar } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { LoginStack, stackConfig, TabNavigator } from '@navigation';
import { NavigationElement } from './src/types';
import { Lato_400Regular, Lato_400Regular_Italic, Lato_700Bold, Lato_900Black } from '@expo-google-fonts/lato';
import { useFonts } from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '@styles';
import { ChatScreen } from '@screens';
import { ActionSheet } from './src/components/actionSheet.component';
import { eventManager } from './src/services';

enableScreens();
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_400Regular_Italic,
    Lato_900Black
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(
    () => {
      const unsubscribeAuthenticationSubject = eventManager.authenticationSubject.subscribe(
        (value) => {
          setLoggedIn(value);
        }
      );

      return () => {
        unsubscribeAuthenticationSubject();
      };
    },
    []
  );

  const getStackNavigator = () => {
    const screenOptions = {
      headerShown: false,
    };

    if (loggedIn) {
      return <>
        <Stack.Screen
          name={NavigationElement.MainTabNavigator}
          component={TabNavigator}
          options={screenOptions}
        />

        <Stack.Screen
          name={NavigationElement.ChatScreen}
          component={ChatScreen}
          options={screenOptions}
        />
      </>
        ;
    } else {
      return <Stack.Screen
        options={screenOptions}
        name={NavigationElement.LoginStack}
        component={LoginStack} />;
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.container}>
    </View>;
  }

  return (
    <SafeAreaView
      edges={loggedIn ? [] : ['left', 'right']}
      style={[styles.safeAreaView, styles.container, globalStyles.containerColorSecondary]}>
      <ExpoStatusBar style='light' />

      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator
          screenOptions={stackConfig}>
          {getStackNavigator()}
        </Stack.Navigator>

        <ActionSheet />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create(
  {
    safeAreaView: {
      paddingTop: StatusBar.currentHeight
    },
    container: {
      flex: 1,
      height: Dimensions.get('window').height
    }
  }
);
