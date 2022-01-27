import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Profile } from "@types";
import { ProfileHeader } from "./components/profileHeader.component";
import { globalStyles } from "@styles";
import { ProfileCard } from "./components/profileCard.component";
import { ScrollView } from "react-native-gesture-handler";
import { Tab, Tabs } from "@components";
import { ParamListBase } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { globals } from "@globals/globals";

interface Props {
  profile: Profile;
  navigation: StackNavigationProp<ParamListBase>;
}

export function ProfileScreen(props: Props): JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs: Tab[] = [
    {
      id: 0,
      text: "Posts",
    },
    {
      id: 1,
      text: "NFTs",
    },
  ];

  return (
    <ScrollView
      style={[styles.container, globalStyles.containerColorMain]}
      bounces={false}
    >
      <ProfileHeader
        profile={globals.loggedInUser as Profile}
        navigation={props.navigation}
      />
      <ProfileCard profile={globals.loggedInUser as Profile} />

      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        onTabClick={(id) => setSelectedTab(id)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
  },
);
