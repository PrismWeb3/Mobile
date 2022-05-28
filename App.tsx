import { DarkTheme, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  AsyncStorage,
  Dimensions,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { enableScreens } from "react-native-screens";
import { LoginStack, stackConfig, TabNavigator } from "@navigation";
import { NavigationElement } from "./src/types";
import PolyfillCrypto from "react-native-webview-crypto";
import {
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_900Black,
} from "@expo-google-fonts/lato";
import { useFonts } from "expo-font";
import { SafeAreaView } from "react-native-safe-area-context";
import { globalStyles } from "@styles";
import { ChatScreen } from "@screens";
import { ActionSheet } from "./src/components/actionSheet.component";
import { eventManager } from "./src/services";
import * as SplashScreen from "expo-splash-screen";
import { globals } from "@globals/globals";

enableScreens();
const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Lato_400Regular,
    Lato_700Bold,
    Lato_400Regular_Italic,
    Lato_900Black,
  });

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(
    () => {
      prepare();

      const unsubscribeAuthenticationSubject = eventManager
        .authenticationSubject.subscribe(
          (value) => {
            setLoggedIn(value);
          },
        );

      return () => {
        unsubscribeAuthenticationSubject();
      };
    },
    [],
  );

  useEffect(
    () => {
      if (!isLoading && fontsLoaded) {
        SplashScreen.hideAsync();
      }
    },
    [isLoading, fontsLoaded],
  );

  const prepare = async () => {
    try {
      await SplashScreen.preventAutoHideAsync();
      // Uncomment if you need to reset storage; Eventually will build a logout button 
      // await AsyncStorage.removeItem("loggedInUser");
      const store = await AsyncStorage.getItem("loggedInUser");
      if (store) {
        globals.loggedInUser = JSON.parse(
          await AsyncStorage.getItem("loggedInUser"),
        );
        eventManager.authenticationSubject.next(true);
        setLoggedIn(true);
      }
      setLoading(false);
    } catch {
    }
  };

  const getStackNavigator = () => {
    const screenOptions = {
      headerShown: false,
    };

    if (loggedIn) {
      return (
        <>
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
      );
    } else {
      return (
        <Stack.Screen
          options={screenOptions}
          name={NavigationElement.LoginStack}
          component={LoginStack}
        />
      );
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={loggedIn ? [] : ["left", "right"]}
      style={[
        styles.safeAreaView,
        styles.container,
        globalStyles.containerColorSecondary,
      ]}
    >
      <PolyfillCrypto />
      <ExpoStatusBar style="light" />

      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator
          screenOptions={stackConfig}
        >
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
      paddingTop: StatusBar.currentHeight,
    },
    container: {
      flex: 1,
      height: Dimensions.get("window").height,
    },
  },
);
