import React, { useEffect, useState } from "react";
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
import { copyObject, eventManager } from "@services";

interface Props {
  navigation: StackNavigationProp<ParamListBase>;
}

export function ProfileScreen(props: Props): JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);
  const [profile, setProfile] = useState<Profile>(
    globals.loggedInUser as Profile,
  );

  const tabs: Tab[] = [
    {
      id: 0,
      text: "NFTs",
    },
    /*{
      id: 1,
      text: "NFTs",
    },*/
  ];

  useEffect(
    () => {
      const profileUpdatedSubscription = eventManager.profileUpdated.subscribe(
        () => {
          const profileCopy = copyObject<Profile>(
            globals.loggedInUser as Profile,
          );
          setProfile(profileCopy);
        },
      );

      return () => {
        profileUpdatedSubscription();
      };
    },
    [],
  );

  return (
    <ScrollView
      style={[styles.container, globalStyles.containerColorMain]}
      bounces={false}
    >
      <ProfileHeader profile={profile} navigation={props.navigation} />
      <ProfileCard profile={profile} />

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
