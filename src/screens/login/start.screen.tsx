import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GradientBackground } from "@components";
import { globalStyles } from "@styles/globalStyles";
import { ParamListBase, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationElement } from "@types";
import { UsernameLogin } from "./components/usernameLogin.component";

export function StartScreen(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      bounces={false}
      keyboardShouldPersistTaps={"handled"}
    >
      <GradientBackground
        colors={["#180136", "#000000"]}
        start={[0, 0]}
        end={[1, 1]}
      />

      <Text style={[styles.logoText, globalStyles.fontFamilyPrimaryItalic]}>
        Welcome to{"\n"}
        <Text
          style={[styles.prismText, globalStyles.fontFamilyPrimaryBoldExtra]}
        >
          Prism
        </Text>
      </Text>

      <UsernameLogin />

      <View
        style={styles.signUpContainer}
      >
        <Text
          style={[
            styles.signUpText,
            globalStyles.fontColorPrimary,
            globalStyles.fontFamilyPrimary,
          ]}
        >
          Are you new to Prism?{" "}
          <Text
            style={[
              globalStyles.fontColorAccent,
              globalStyles.fontFamilyPrimaryBold,
            ]}
            onPress={() => navigation.push(NavigationElement.SignUpScreen)}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
    },
    logoText: {
      marginTop: "40%",
      marginLeft: "auto",
      marginRight: "auto",
      color: "#d9d9d9",
      fontSize: 13,
      textAlign: "center",
      lineHeight: 48,
    },
    prismText: {
      fontSize: 42,
      color: "white",
    },
    signUpContainer: {
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      marginTop: "auto",
      marginBottom: " 15%",
      paddingHorizontal: 30,
    },
    signUpText: {
      fontSize: 16,
    },
  },
);
