import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GradientBackground } from "@components";
import { globalStyles } from "@styles";
import { ParamListBase, RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationElement } from "@types";
import { BarCodeScanner } from "expo-barcode-scanner";
import { eventManager } from "@services";

type RouteParams = {
  [NavigationElement.LoginScannerScreen]: {
    username: string;
  };
};

interface Props {
  route: RouteProp<RouteParams, NavigationElement.LoginScannerScreen>;
  navigation: StackNavigationProp<ParamListBase>;
}

export function LoginScannerScreen(props: Props): JSX.Element {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const { username } = props.route.params;

  useEffect(
    () => {
      checkCameraPermission();
    },
    [],
  );

  const checkCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = (
    { type, data }: { type: string; data: string },
  ) => {
    setScanned(true);
    // login with barcode logic

    eventManager.authenticationSubject.next(true);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text
          style={[
            globalStyles.fontColorPrimary,
            globalStyles.fontFamilyPrimary,
          ]}
        >
          Requesting for camera permission
        </Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text
          style={[
            globalStyles.fontColorPrimary,
            globalStyles.fontFamilyPrimary,
          ]}
        >
          No access to camera
        </Text>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
    >
      <GradientBackground
        colors={["#180136", "#000000"]}
        start={[0, 0]}
        end={[1, 1]}
      />

      <Text
        style={[
          styles.title,
          globalStyles.fontColorPrimary,
          globalStyles.fontFamilyPrimary,
        ]}
      >
        Hello
        <Text style={[globalStyles.fontFamilyPrimaryBoldExtra]}>
          {username}!
        </Text>
      </Text>

      <Text
        style={[
          styles.info,
          globalStyles.fontColorPrimary,
          globalStyles.fontFamilyPrimary,
        ]}
      >
        Please scan the temp QR code to continue
      </Text>

      <View
        style={styles.barcodeScannerWrapper}
      >
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.barcodeScanner}
        />
      </View>

      <Text
        style={[
          globalStyles.fontColorAccent,
          globalStyles.fontFamilyPrimaryBold,
        ]}
        onPress={() => props.navigation.goBack()}
      >
        Cancel
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 25,
      marginBottom: 20,
    },
    info: {
      fontSize: 14,
      marginBottom: 20,
    },
    barcodeScannerWrapper: {
      width: "80%",
      height: "35%",
      borderRadius: 50,
      overflow: "hidden",
      marginBottom: 20,
    },
    barcodeScanner: {
      width: "100%",
      height: "100%",
    },
  },
);
