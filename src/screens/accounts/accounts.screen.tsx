import { ParamListBase } from "@react-navigation/routers";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { DefaultScreenHeader } from "@components";
import { globalStyles } from "@styles";
import { authenticateWithDeSoIdentity } from "@services";
import * as SecureStore from "expo-secure-store";
import { Constants } from "@globals";

interface Props {
  navigation: StackNavigationProp<ParamListBase>;
}

export function AccountsScreen(props: Props): JSX.Element {
  const [deSoConnected, setDeSoConnected] = useState(false);
  const [deSoLoading, setDeSoLoading] = useState(false);
  const [ethConnected, setEthConnected] = useState(false);

  const isMounted = useRef(false);

  useEffect(
    () => {
      isMounted.current = true;

      checkDeSoConnection();

      return () => {
        isMounted.current = false;
      };
    },
    [],
  );

  const checkDeSoConnection = async () => {
    const deSoConnection = await SecureStore.getItemAsync(
      Constants.SECURE_STORAGE_DESO_CONNECTION,
    );
    setDeSoConnected(deSoConnection != null);
  };

  const connectDeSo = async () => {
    if (deSoConnected) {
      Alert.alert(
        "Disconnect",
        "Are you sure you'd like to disconnect Deso?",
        [
          {
            text: "Yes",
            onPress: () => {
              setDeSoConnected(false);
              SecureStore.deleteItemAsync(
                Constants.SECURE_STORAGE_DESO_CONNECTION,
              );
            },
          },
          {
            text: "No",
            onPress: () => {},
            style: "cancel",
          },
        ],
      );

      return;
    }

    setDeSoLoading(true);
    const success = await authenticateWithDeSoIdentity();

    if (isMounted.current) {
      setDeSoLoading(false);
      setDeSoConnected(success);
    }
  };

  const renderConnected = () => {
    return (
      <>
        <View style={styles.connectedBullet} />
        <Text style={styles.connectedText}>Connected</Text>
      </>
    );
  };

  return (
    <View style={[styles.container, globalStyles.containerColorMain]}>
      <DefaultScreenHeader
        title={"Accounts"}
        back={true}
        navigation={props.navigation}
      />

      <TouchableOpacity style={styles.accountContainer}>
        <Image
          style={styles.ethLogo}
          source={require("../../../assets/ethereum.png")}
        />
        <Text style={[styles.logoText, globalStyles.fontColorPrimary]}>
          Ethereum
        </Text>

        {ethConnected && renderConnected()}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.accountContainer}
        onPress={connectDeSo}
      >
        <Image
          style={styles.desoLogo}
          source={require("../../../assets/deso.png")}
        />
        <Text style={[styles.logoText, globalStyles.fontColorPrimary]}>
          DeSo
        </Text>

        {deSoConnected && renderConnected()}
        {deSoLoading && (
          <ActivityIndicator
            size={"small"}
            color={globalStyles.fontColorSecondary.color}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
    },
    accountContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: globalStyles.containerColorSecondary.backgroundColor,
    },
    desoLogo: {
      width: 20,
      height: 20,
      marginRight: 12,
    },
    ethLogo: {
      width: 16,
      height: 24,
      marginRight: 14,
    },
    logoText: {
      fontSize: 18,
      marginRight: 12,
    },
    connectedBullet: {
      width: 6,
      height: 6,
      borderRadius: 10,
      backgroundColor: "#217a2d",
    },
    connectedText: {
      fontSize: 12,
      marginLeft: 4,
      color: "#217a2d",
      fontWeight: "600",
    },
  },
);
