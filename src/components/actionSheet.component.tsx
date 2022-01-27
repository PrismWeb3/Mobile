import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import { eventManager } from "@services";
import { globalStyles } from "@styles";
import { ActionSheetOption } from "@types";

export function ActionSheet(): JSX.Element {
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState<ActionSheetOption[]>([]);

  useEffect(
    () => {
      const subscription = eventManager.actionSheet.subscribe(
        (event) => {
          setVisible(true);
          setOptions(event.options);
        },
      );

      return () => {
        subscription();
      };
    },
    [],
  );

  const onOptionClick = (option: ActionSheetOption) => {
    close();
    option.callback();
  };

  const close = () => {
    setVisible(false);
  };

  if (!visible) {
    return <></>;
  }

  return (
    <Modal
      animationIn={"slideInUp"}
      animationOut={"slideOutDown"}
      swipeDirection="down"
      animationOutTiming={500}
      onSwipeComplete={close}
      onBackdropPress={close}
      onBackButtonPress={close}
      isVisible={true}
      style={styles.container}
    >
      <View style={[styles.optionsContainer]}>
        {options.map(
          (option: ActionSheetOption, index: number) => (
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonBorder,
              ]}
              key={index.toString()}
              onPress={() => onOptionClick(option)}
              activeOpacity={0.6}
            >
              {option.icon}
              <Text
                style={[
                  styles.optionText,
                  globalStyles.fontColorPrimary,
                  option.icon && styles.optionTextMargin,
                ]}
              >
                {option.text}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      <View style={[styles.cancelContainer]}>
        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonCancel]}
          onPress={close}
          activeOpacity={0.6}
        >
          <Text style={[styles.optionText, globalStyles.fontColorPrimary]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      marginLeft: 15,
      marginRight: 15,
    },
    optionsContainer: {
      opacity: 1,
      marginTop: "auto",
      borderRadius: 15,
      backgroundColor: "#242424",
    },
    optionButton: {
      flexDirection: "row",
      height: 54,
      alignItems: "center",
      paddingHorizontal: 20,
    },
    optionButtonBorder: {
      borderBottomWidth: 1,
      borderColor: "#2b2b2b",
    },
    optionButtonCancel: {
      justifyContent: "center",
    },
    cancelContainer: {
      marginTop: 10,
      borderRadius: 15,
      marginBottom: Platform.OS === "ios" ? 10 : 0,
      backgroundColor: "#242424",
    },
    optionText: {
      fontSize: 18,
      fontWeight: "500",
    },
    optionTextMargin: {
      marginLeft: 16,
    },
  },
);
