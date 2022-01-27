import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ChatMediaModalEvent, Contact, Message } from "@types";
import { globalStyles } from "@styles";
import { formatTime } from "@services";
import { Swipeable, TouchableOpacity } from "react-native-gesture-handler";
import Entypo from "@expo/vector-icons/build/Entypo";
import * as Haptics from "expo-haptics";
import { chatEventManager } from "../chatEventManager";
import { ChatReplyMessage } from "./chatReplyMessage.component";

interface Props {
  message: Message;
  contact: Contact;
  goToReply: (message: Message) => void;
}

export function ChatMessage(props: Props): JSX.Element {
  const swipeable = useRef<Swipeable>(null);

  const animateNewMessage = useRef(new Animated.Value(100));
  const messageColor = props.message.isSender ? "#4287f5" : "#363636";
  const isNew = !!props.message.new;

  useEffect(
    () => {
      if (isNew) {
        const animationDuration = 100;

        Animated.timing(
          animateNewMessage.current,
          {
            toValue: 0,
            useNativeDriver: true,
            duration: animationDuration,
          },
        ).start();

        setTimeout(() => props.message.new = false, animationDuration);
      }
    },
    [],
  );

  const isEmoji = () => {
    const regex =
      /^(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff]|\s+)+$/g;
    const emojis = props.message.text.trim().match(regex);

    return emojis;
  };

  const reply = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    swipeable.current?.close();
    chatEventManager.reply.next(props.message);
  };

  const showMediaModal = () => {
    const mediaEvent: ChatMediaModalEvent = {
      uri: props.message.media?.uri as string,
      showActionBar: false,
      showSaveButton: true,
    };
    chatEventManager.mediaModal.next(mediaEvent);
  };

  const getMediaDimensions = ():
    | { width: number; height: number }
    | undefined => {
    const media = props.message.media;
    if (!media) {
      return undefined;
    }

    const windowsWidth = Dimensions.get("window").width;
    const messageWidth = windowsWidth * 0.8;
    const ratio = messageWidth / media.width;

    return {
      width: messageWidth,
      height: Math.min(media.height * ratio, 300),
    };
  };

  const renderRightCancelSwipe = (
    dragX: Animated.AnimatedInterpolation,
  ): JSX.Element | undefined => {
    const scale = dragX.interpolate(
      {
        inputRange: [-100, 0],
        outputRange: [1, 0.3],
        extrapolate: "clamp",
      },
    );

    return (
      <Animated.View
        style={[
          styles.replyIconContainer,
          { transform: [{ scale: scale }] },
        ]}
      >
        <Entypo name="reply" size={24} color="white" />
      </Animated.View>
    );
  };

  const arrowStyles = props.message.isSender
    ? [styles.rightArrow, { backgroundColor: messageColor }]
    : [styles.leftArrow, { backgroundColor: messageColor }];
  const arrowOverlap = props.message.isSender
    ? [styles.rightArrowOverlap]
    : [styles.leftArrowOverlap];

  return (
    <Animated.View
      style={[
        isNew && {
          transform: [
            { translateY: animateNewMessage.current },
          ],
        },
      ]}
    >
      <Swipeable
        containerStyle={styles.swipeableContainer}
        ref={swipeable}
        onSwipeableWillOpen={() => reply()}
        renderRightActions={(
          _progress: Animated.AnimatedInterpolation,
          dragX: Animated.AnimatedInterpolation,
        ) => renderRightCancelSwipe(dragX)}
        rightThreshold={100}
      >
        <View
          style={[
            styles.container,
            props.message.lastOfGroup && styles.marginBottom,
            props.message.isSender ? styles.sender : styles.receiver,
            props.message.media != null && styles.removePaddingTop,
          ]}
        >
          {props.message.reply != null &&
            (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => props.goToReply(props.message.reply as Message)}
              >
                <ChatReplyMessage
                  message={props.message.reply}
                  contact={props.contact}
                  headerColor={props.message.isSender
                    ? globalStyles.fontColorPrimary.color
                    : globalStyles.fontColorAccent.color}
                />
              </TouchableOpacity>
            )}

          {props.message.media &&
            (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={showMediaModal}
              >
                <Image
                  style={[styles.image, getMediaDimensions()]}
                  source={{ uri: props.message.media.uri }}
                />
              </TouchableOpacity>
            )}

          {!!props.message.text &&
            (
              <Text
                style={[
                  styles.text,
                  globalStyles.fontColorPrimary,
                  isEmoji() && styles.emojiStyle,
                ]}
              >
                {props.message.text}
              </Text>
            )}

          <Text style={[styles.time]}>{formatTime(props.message.time)}</Text>

          {props.message.lastOfGroup &&
            (
              <>
                <View style={[arrowStyles]} />
                <View style={[arrowOverlap, globalStyles.containerColorMain]} />
              </>
            )}
        </View>
      </Swipeable>

      {/* this overlay is used to allow swiping back*/}
      {!props.message.isSender &&
        <View style={styles.swipeBackOverlay}></View>}
    </Animated.View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      justifyContent: "center",
      paddingTop: 6,
      paddingBottom: 14,
      marginBottom: 3,
      marginHorizontal: 8,
      borderRadius: 15,
      minWidth: 75,
      maxWidth: "80%",
    },
    swipeableContainer: {
      marginLeft: 50,
      overflow: "visible",
    },
    removePaddingTop: {
      paddingTop: 0,
    },
    sender: {
      marginLeft: "auto",
      backgroundColor: "#4287f5",
    },
    receiver: {
      marginRight: "auto",
      backgroundColor: "#363636",
      transform: [{ translateX: -45 }],
    },
    text: {
      paddingHorizontal: 12,
      fontSize: 16,
    },
    leftArrowOverlap: {
      position: "absolute",
      width: 20,
      height: 35,
      bottom: -6,
      borderBottomRightRadius: 18,
      left: -19.7,
    },
    leftArrow: {
      position: "absolute",
      width: 20,
      height: 17,
      bottom: -2,
      borderBottomRightRadius: 25,
      left: -10,
    },
    rightArrowOverlap: {
      position: "absolute",
      width: 20,
      height: 35,
      right: -20,
      bottom: -6,
      borderBottomLeftRadius: 25,
    },
    rightArrow: {
      position: "absolute",
      width: 20,
      height: 17,
      bottom: -2,
      borderBottomLeftRadius: 25,
      right: -10,
    },
    marginBottom: {
      marginBottom: 8,
    },
    emojiStyle: {
      fontSize: 35,
    },
    time: {
      color: "#dbdbdb",
      position: "absolute",
      bottom: 2,
      right: 10,
      fontSize: 9.5,
      textAlign: "right",
    },
    replyIconContainer: {
      justifyContent: "center",
      alignItems: "center",
      marginRight: "10%",
    },
    image: {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      marginBottom: 8,
    },
    swipeBackOverlay: {
      position: "absolute",
      left: 0,
      width: 30,
      height: "100%",
    },
  },
);
