import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { controlStyles, globalStyles } from "@styles";
import { GradientBackground } from "@components";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationElement } from "@types";
import { Constants } from "@globals";
import { post } from "@services";

export function UsernameLogin(): JSX.Element {
  const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

  const [username, setUsername] = useState<string>("");

  const handleLogIn = async () => {
    console.log(Constants.PRISM_BASE_URL);
    await post(
      Constants.PRISM_BASE_URL,
      "getUser",
      {
        username: username,
      },
    ).then((r: Response) => {
      // We probally want to pass data from r to the next screen, but we'll deal with that once scanning is implemented
      navigation.push(
        NavigationElement.LoginScannerScreen,
        {
          username,
        },
      );
    })
      .catch(() => {
        /*
      It would probally be better UX to have a label under the textbox that says "Username does not exist" or something, but for now
      using an alert should be fine. Consider changing this before release!
      */

        Alert.alert(
          "Invalid Username",
          "This user doesn't exist! Please try again.",
        );
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text
        style={[
          styles.getStartedText,
          globalStyles.fontFamilyPrimary,
          globalStyles.fontColorPrimary,
        ]}
      >
        Let's get started
      </Text>
      <TextInput
        style={[controlStyles.textInput, globalStyles.fontFamilyPrimaryBold]}
        placeholder="Username"
        keyboardAppearance={"dark"}
        onChangeText={setUsername}
        maxLength={Constants.USERNAME_MAX_LENGTH}
      />

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.9}
        onPress={async () => await handleLogIn()}
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
            styles.loginText,
            globalStyles.fontFamilyPrimaryBold,
            globalStyles.fontColorPrimary,
          ]}
        > Login
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      marginLeft: "auto",
      marginRight: "auto",
      alignItems: "center",
      width: "65%",
      marginTop: "35%",
    },
    getStartedText: {
      marginBottom: 12,
      fontSize: 16,
    },
    button: {
      marginTop: 20,
      height: 50,
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 50,
    },
    loginText: {
      fontSize: 18,
    },
  },
);
