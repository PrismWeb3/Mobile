import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Contact } from "@types";
import { globalStyles } from "@styles";
import { formatTime } from "@services";

interface Props {
  contact: Contact;
}

export function ChatContact(props: Props): JSX.Element {
  const contact = props.contact;

  const time = formatTime(contact.lastMessageTime);

  return (
    <View style={[styles.container, globalStyles.containerColorMain]}>
      <Image
        style={styles.image}
        source={{ uri: contact.imageURL }}
      />
      <View style={styles.wrapper}>
        <View style={styles.messageHeader}>
          <Text
            style={[styles.username, globalStyles.fontColorPrimary]}
          >
            {contact.username}
          </Text>
          <Text
            style={[styles.time, globalStyles.fontColorSecondary]}
          >
            {time}
          </Text>
        </View>
        <Text
          style={[styles.message, globalStyles.fontColorSecondary]}
        >
          {contact.lastMessage}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flexDirection: "row",
      paddingTop: 15,
      paddingLeft: 20,
      paddingRight: 10,
      height: 75,
      width: "100%",
    },
    image: {
      width: 55,
      height: 55,
      borderRadius: 30,
      marginRight: 15,
    },
    wrapper: {
      flex: 1,
      borderBottomWidth: 1,
      borderBottomColor: "#212121",
      paddingRight: 10,
    },
    messageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 2,
    },
    username: {
      fontSize: 17,
      fontWeight: "700",
    },
    time: {
      fontSize: 12,
    },
    message: {
      fontSize: 15,
    },
  },
);
