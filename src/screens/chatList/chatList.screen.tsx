import React, { useState } from "react";
import {
  Animated,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "@styles";
import { Contact, NavigationElement } from "@types";
import { chatContacts } from "./chatListData";
import { ChatContact } from "./components/chatContact.component";
import { ChatListHeader } from "./components/chatListHeader.component";
import { StackNavigationProp } from "@react-navigation/stack";
import { ParamListBase } from "@react-navigation/routers";
import { Swipeable } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";

interface Props {
  navigation: StackNavigationProp<ParamListBase>;
}

export function ChatListScreen(props: Props): JSX.Element {
  const [contacts, setContacts] = useState(chatContacts);

  const deleteContact = (index: number) => {
    const newContact = contacts.slice(0);
    newContact.splice(index, 1);
    setContacts(newContact);
  };

  const renderRightCancelSwipe = (
    dragX: Animated.AnimatedInterpolation,
    index: number,
  ): JSX.Element | undefined => {
    const scale = dragX.interpolate(
      {
        inputRange: [-100, 0],
        outputRange: [1, 0.3],
        extrapolate: "clamp",
      },
    );

    return (
      <TouchableOpacity
        style={styles.deleteIconContainer}
        activeOpacity={0.7}
        onPress={() => deleteContact(index)}
      >
        <Animated.View
          style={[
            { transform: [{ scale: scale }] },
          ]}
        >
          <AntDesign name="delete" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item: Contact, index: number) =>
    item.username + String(index);
  const renderItem = ({ item, index }: { item: Contact; index: number }) => (
    <Swipeable
      renderRightActions={(
        _progress: Animated.AnimatedInterpolation,
        dragX: Animated.AnimatedInterpolation,
      ) => renderRightCancelSwipe(dragX, index)}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() =>
          props.navigation.push(
            NavigationElement.ChatScreen,
            { contact: JSON.stringify(item) },
          )}
      >
        <ChatContact contact={item} />
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View
      style={[styles.container, globalStyles.containerColorMain]}
    >
      <ChatListHeader />

      <FlatList
        data={contacts}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={15}
        onEndReachedThreshold={3}
      />
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    deleteIconContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#C70000",
      width: 80,
    },
  },
);
