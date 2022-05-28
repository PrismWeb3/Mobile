import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Profile } from "@types";
import { globalStyles } from "@styles";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  profile: Profile;
}

export function ProfileCard(props: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image
          style={styles.image}
          source={{ uri: props.profile.imageURL }}
        />

        <View>
          <View style={styles.row}>
            <Text style={[styles.name, globalStyles.fontColorPrimary]}>
              {props.profile.name}
            </Text>

            {props.profile.verified &&
              (
                <MaterialIcons
                  name="verified"
                  size={22}
                  color={globalStyles.fontColorAccent.color}
                />
              )}
          </View>

          <Text style={[styles.bio, globalStyles.fontColorPrimary]}>
            {props.profile.bio}
          </Text>
        </View>
      </View>

      <View style={[styles.followContainer, styles.row]}>
        <View style={styles.followWrapper}>
          <Text style={[styles.followCount, globalStyles.fontColorPrimary]}>
            {props.profile.followers}
          </Text>
          <Text style={[styles.followLabel, globalStyles.fontColorSecondary]}>
            Followers
          </Text>
        </View>

        <View style={[styles.followSeparator]} />
        <View style={styles.followWrapper}>
          <Text style={[styles.followCount, globalStyles.fontColorPrimary]}>
            {props.profile.following}
          </Text>
          <Text style={[styles.followLabel, globalStyles.fontColorSecondary]}>
            Following
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      paddingVertical: "5%",
      paddingHorizontal: "5%",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 50,
      marginRight: 20,
    },
    name: {
      fontWeight: "700",
      fontSize: 22,
      marginRight: 6,
    },
    bio: {
      marginTop: 4,
      lineHeight: 18,
    },
    followContainer: {
      justifyContent: "space-around",
      marginTop: 25,
    },
    followWrapper: {
      alignItems: "center",
      marginHorizontal: "15%",
    },
    followCount: {
      fontWeight: "700",
      fontSize: 24,
    },
    followLabel: {
      fontSize: 11,
      fontWeight: "600",
    },
    followSeparator: {
      width: 1,
      backgroundColor: globalStyles.fontColorAccent.color,
      height: "100%",
    },
  },
);
