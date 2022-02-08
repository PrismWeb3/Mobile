import React, { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "@styles";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { EditProfileHeader } from "./components/editProfileHeader.component";
import { globals } from "@globals/globals";
import { Profile } from "@types";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native-gesture-handler";
import { eventManager } from "@services/eventManager";
import { editProfile } from "@services";

interface Props {
  navigation: StackNavigationProp<ParamListBase>;
}

export function EditProfileScreen(props: Props): JSX.Element {
  const profile = globals.loggedInUser as Profile;

  const [image, setImage] = useState(profile.image);
  const [username, setUsername] = useState(profile.username);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);

  const editImage = async () => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker
        .requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert(
          "In order to be able to choose one of your images and attach it to your comment, we need access to your photos.",
        );
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync(
      {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 3],
        base64: true,
      },
    );

    if (!result.cancelled && result.type === "image") {
      // TO DO: Send image to server, have server upload image to IPFS & store hash
      // For now, we'll just send back the img
      setImage(`data:image/jpg;base64,${result.base64 as string}`);
    }
  };

  const handleEditProfile = async () => {
    const newUser = await editProfile(name, username, bio, image);
    if (!newUser) {
      Alert.alert(
        "Unknown Error",
        "An unknown error occured! Please try again.",
      );
    } else {
      eventManager.authenticationSubject.next(true);
      eventManager.profileUpdated.next();
      props.navigation.goBack();
    }
  };

  return (
    <ScrollView
      style={[styles.container, globalStyles.containerColorMain]}
      bounces={false}
      keyboardShouldPersistTaps={"handled"}
    >
      <EditProfileHeader
        navigation={props.navigation}
        save={handleEditProfile}
      />

      <Image style={styles.image} source={{ uri: image }} />
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={editImage}
      >
        <Text style={[styles.editText, globalStyles.fontColorAccent]}>
          Edit
        </Text>
      </TouchableOpacity>

      <View style={styles.textInputContainer}>
        <Text style={[styles.label, globalStyles.fontColorSecondary]}>
          Username
        </Text>
        <TextInput
          style={[styles.textInput, globalStyles.fontColorPrimary]}
          value={username}
          onChangeText={setUsername}
          keyboardAppearance={"dark"}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={[styles.label, globalStyles.fontColorSecondary]}>
          Name
        </Text>
        <TextInput
          style={[styles.textInput, globalStyles.fontColorPrimary]}
          value={name}
          onChangeText={setName}
          keyboardAppearance={"dark"}
        />
      </View>

      <View style={styles.textInputContainer}>
        <Text style={[styles.label, globalStyles.fontColorSecondary]}>
          Bio
        </Text>
        <TextInput
          style={[styles.textInput, globalStyles.fontColorPrimary]}
          value={bio}
          onChangeText={setBio}
          multiline={true}
          keyboardAppearance={"dark"}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    image: {
      width: 90,
      height: 90,
      borderRadius: 50,
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: 20,
    },
    editText: {
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: 16,
      marginTop: 10,
    },
    textInputContainer: {
      marginLeft: 12,
      marginBottom: 16,
    },
    label: {},
    textInput: {
      paddingBottom: 6,
      paddingTop: 6,
      borderBottomWidth: 1,
      borderBottomColor: globalStyles.containerColorSecondary.backgroundColor,
    },
  },
);
