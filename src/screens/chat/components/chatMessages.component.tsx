import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Contact, Message } from "@types";
import { ChatMessage } from "./chatMessage.component";
import { globalStyles } from "@styles";
import { formatDate, generateRandomKey } from "@services";
import { chatMessages } from "../chatData";
import { AntDesign } from "@expo/vector-icons";
import { chatEventManager } from "../chatEventManager";

interface Props {
  contact: Contact;
}

interface MessagesSection {
  date: string;
  data: Message[];
}

export function ChatMessages(props: Props): JSX.Element {
  const sectionListRef = useRef<SectionList<Message, MessagesSection>>(null);

  const [sections, setSections] = useState<MessagesSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollIcon, setShowScrollIcon] = useState(false);

  const lastIndex = useRef(chatMessages.length);
  const isMounted = useRef(false);
  const batchSize = 30;

  useEffect(
    () => {
      isMounted.current = true;
      loadMessages();

      return () => {
        isMounted.current = false;
      };
    },
    [],
  );

  useEffect(
    () => {
      const newMessageSubscription = chatEventManager.newMessage.subscribe(
        (message) => {
          updateSections([message], true);
          scrollToBottom();
        },
      );

      return () => {
        newMessageSubscription();
      };
    },
    [sections],
  );

  const loadMessages = () => {
    const startIndex = Math.max(0, chatMessages.length - batchSize);
    const messages = chatMessages.slice(startIndex);
    lastIndex.current = startIndex;

    updateSections(messages);
    setIsLoading(false);
  };

  const loadMoreMessages = () => {
    if (isLoading || isLoadingMore || lastIndex.current === 0) {
      return;
    }

    setIsLoadingMore(true);

    setTimeout(
      () => {
        const startIndex = Math.max(0, lastIndex.current - batchSize);
        const messages = chatMessages.slice(startIndex, lastIndex.current);

        if (isMounted.current) {
          updateSections(messages);
          setIsLoadingMore(false);
          lastIndex.current = startIndex;
        }
      },
      3000,
    );
  };

  const updateSections = (messages: Message[], newMessage = false) => {
    const newSections = sections.slice(0);
    const groupedMessages = groupMessagesByDay(messages);

    const keys = Object.keys(groupedMessages);

    for (const key of keys) {
      const messages = groupedMessages[key];
      const existedSection = sections.find((section) => section.date === key);

      if (existedSection) {
        if (newMessage) {
          existedSection.data.unshift(...messages);
        } else {
          existedSection.data.push(...messages);
        }
      } else {
        const newSection: MessagesSection = {
          date: key,
          data: messages,
        };

        if (newMessage) {
          newSections.unshift(newSection);
        } else {
          newSections.push(newSection);
        }
      }

      const sectionMessages = existedSection
        ? existedSection.data
        : newSections[newSections.length - 1].data;

      if (sectionMessages.length > 0) {
        sectionMessages[0].lastOfGroup = true;
        for (let i = 1; i < sectionMessages.length; i++) {
          sectionMessages[i].lastOfGroup =
            sectionMessages[i].isSender !== sectionMessages[i - 1].isSender;
        }
      }
    }

    setSections(newSections);
  };

  function groupMessagesByDay(
    messages: Message[],
  ): { [key: string]: Message[] } {
    const dayMessagesMap: { [key: string]: Message[] } = {};
    for (let i = messages.length - 1; i >= 0; i--) {
      const messageTime = messages[i].time;

      const formattedMessageDate = isToday(messageTime)
        ? "Today"
        : formatDate(messageTime);

      if (!dayMessagesMap[formattedMessageDate]) {
        dayMessagesMap[formattedMessageDate] = [];
      }
      dayMessagesMap[formattedMessageDate].push(messages[i]);
    }

    return dayMessagesMap;
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear();
  }

  const onScroll = (event: NativeScrollEvent) => {
    const scrollOffset = event.contentOffset.y;
    setShowScrollIcon(scrollOffset > 200);
  };

  const scrollToBottom = () => {
    if (sectionListRef.current == null) {
      return;
    }

    try {
      sectionListRef.current.scrollToLocation({
        itemIndex: 0,
        sectionIndex: 0,
        animated: true,
      });
    } catch {
    }
  };

  const goToReply = (message: Message) => {
    if (sectionListRef.current == null) {
      return;
    }

    try {
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];

        // must use message ID
        const messageIndex = section.data.findIndex((m) =>
          m.text === message.text
        );

        if (messageIndex !== -1) {
          sectionListRef.current.scrollToLocation({
            itemIndex: messageIndex,
            sectionIndex: i,
            animated: true,
            viewPosition: 0.5,
          });
          break;
        }
      }
    } catch {}
  };

  const keyExtractor = (item: Message) => {
    // remove this once we have id from backend
    if (item.id == null) {
      item.id = generateRandomKey();
    }

    return item.id;
  };

  const renderItem = ({ item }: { item: Message; index: number }) => (
    <ChatMessage message={item} contact={props.contact} goToReply={goToReply} />
  );

  const renderSectionFooter = (
    { section }: { section: MessagesSection },
  ): JSX.Element => <Text style={[styles.dateText]}>{section.date}</Text>;

  const renderFooter = isLoadingMore
    ? (
      <ActivityIndicator
        style={styles.activityIndicator}
        color={globalStyles.fontColorPrimary.color}
      />
    )
    : <></>;

  return (
    <>
      <SectionList
        ref={sectionListRef}
        inverted
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={renderFooter}
        renderSectionFooter={renderSectionFooter}
        initialNumToRender={20}
        onEndReachedThreshold={3}
        onEndReached={loadMoreMessages}
        onScroll={(event) => onScroll(event.nativeEvent)}
        keyboardShouldPersistTaps={"handled"}
      />

      {showScrollIcon &&
        (
          <TouchableOpacity
            onPress={scrollToBottom}
            activeOpacity={1}
            style={[
              styles.floatingArrow,
              globalStyles.containerColorSecondary,
            ]}
          >
            <AntDesign
              name="downcircleo"
              size={24}
              color={globalStyles.fontColorAccent.color}
            />
          </TouchableOpacity>
        )}
    </>
  );
}

const styles = StyleSheet.create(
  {
    activityIndicator: {
      marginTop: 10,
    },
    dateText: {
      marginVertical: 12,
      fontSize: 11,
      fontWeight: "700",
      textAlign: "center",
      color: "white",
    },
    floatingArrow: {
      position: "absolute",
      bottom: 110,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      borderWidth: 1,
      borderRightWidth: 0,
      borderColor: "#454545",
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
  },
);
