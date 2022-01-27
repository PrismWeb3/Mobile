import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "@styles";

export interface Tab {
  id: number;
  text: string;
}

interface Props {
  tabs: Tab[];
  selectedTab: number;
  onTabClick: (id: number) => void;
}

export function Tabs(props: Props): JSX.Element {
  return (
    <View style={[styles.container, globalStyles.containerColorMain]}>
      {props.tabs.map(
        (tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              props.selectedTab === tab.id ? styles.selectedTab : {},
            ]}
            activeOpacity={1}
            onPress={() => props.onTabClick(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                globalStyles.fontColorPrimary,
                props.selectedTab === tab.id ? styles.selectedTabText : {},
              ]}
            >
              {tab.text}
            </Text>
          </TouchableOpacity>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flexDirection: "row",
      alignItems: "center",
      height: 40,
      width: "100%",
    },
    tab: {
      height: 40,
      paddingLeft: 10,
      paddingRight: 10,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    tabText: {
      fontWeight: "500",
      fontSize: 15,
    },
    selectedTabText: {
      fontWeight: "bold",
    },
    selectedTab: {
      borderBottomWidth: 2,
      borderBottomColor: globalStyles.fontColorAccent.color,
    },
  },
);
