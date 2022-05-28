import React from "react";
import { Contact } from "@types";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@styles";
import { Ionicons } from "@expo/vector-icons";
import { ParamListBase } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

interface Props {
  contact: Contact;
  navigation: StackNavigationProp<ParamListBase>;
}

export function ChatHeader(props: Props): JSX.Element {
  return (
    <View style={[styles.container, globalStyles.containerColorSecondary]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => props.navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color="white" />
      </TouchableOpacity>

      <Image
        style={styles.image}
        source={{ uri: props.contact.imageURL }}
      />

      <Text
        style={[styles.username, globalStyles.fontColorPrimary]}
      >
        {props.contact.username}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    image: {
      width: 45,
      height: 45,
      borderRadius: 50,
      marginLeft: 15,
      marginRight: 10,
    },
    username: {
      fontSize: 18,
      fontWeight: "700",
    },
  },
);
