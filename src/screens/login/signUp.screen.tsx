import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GradientBackground } from "@components";
import { controlStyles, globalStyles } from "@styles";
import { ParamListBase } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { Constants } from "@globals";
import { signUp } from "@services";
import { globals } from "@globals/globals";
import { eventManager } from "@services";
interface Props {
  navigation: StackNavigationProp<ParamListBase>;
}

export function SignUpScreen(props: Props): JSX.Element {
  globals.webViewEnabled = true;
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");

  const handleSignUp = async () => {
    const success = await signUp(username, name)
      if (success) eventManager.authenticationSubject.next(true);
      else {
        Alert.alert(
          "Unknown Error",
          "An unknown error occured! Please try again.",
        );
      }
  };

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

      <Text
        style={[
          styles.signUpTitle,
          globalStyles.fontFamilyPrimaryBold,
          globalStyles.fontColorPrimary,
        ]}
      >
        Create an Account
      </Text>

      <KeyboardAvoidingView style={styles.wrapperView}>
        <TextInput
          style={[
            styles.textInput,
            controlStyles.textInput,
            globalStyles.fontFamilyPrimaryBold,
          ]}
          onChangeText={setUsername}
          maxLength={Constants.USERNAME_MAX_LENGTH}
          placeholder={"Username"}
          keyboardAppearance={"dark"}
        >
        </TextInput>

        <TextInput
          style={[
            styles.textInput,
            controlStyles.textInput,
            globalStyles.fontFamilyPrimaryBold,
          ]}
          onChangeText={setName}
          placeholder={"Name"}
          keyboardAppearance={"dark"}
        >
        </TextInput>

        <TouchableOpacity
          style={styles.signUpButton}
          activeOpacity={0.9}
          onPress={() => handleSignUp()}
        >
          <GradientBackground
            colors={["#DF02C5", "#5C04CF"]}
            borderRadius={26}
            start={[0, 0]}
            end={[1, 1]}
            locations={[0.2, 0.75]}
          />

          <Text
            style={[
              styles.signUpButtonText,
              globalStyles.fontFamilyPrimaryBold,
              globalStyles.fontColorPrimary,
            ]}
          >
            Sign up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <View
        style={styles.loginContainer}
      >
        <Text
          style={[
            styles.loginText,
            globalStyles.fontColorPrimary,
            globalStyles.fontFamilyPrimary,
          ]}
        >
          Already have an account?
          <Text
            style={[
              globalStyles.fontColorAccent,
              globalStyles.fontFamilyPrimaryBold,
            ]}
            onPress={() => props.navigation.goBack()}
          > Login
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
      paddingTop: "50%",
      alignItems: "center",
    },
    wrapperView: {
      marginTop: "20%",
      width: "65%",
      alignItems: "center",
    },
    signUpTitle: {
      fontSize: 30,
      marginBottom: 50,
    },
    textInput: {
      marginBottom: 20,
    },
    signUpButton: {
      marginTop: 0,
      height: 50,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
    },
    signUpButtonText: {
      fontSize: 18,
    },
    loginContainer: {
      height: 100,
      justifyContent: "center",
      alignItems: "center",
      marginTop: "auto",
      marginBottom: " 15%",
      paddingHorizontal: 30,
    },
    loginText: {
      fontSize: 16,
    },
  },
);
