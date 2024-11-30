import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";

import logoImg from "../assets/images/logo/logo.png";

interface HeaderProps {
  tasksCounter: number;
}

export function Header({ tasksCounter }: HeaderProps) {
  const tasksCounterText = tasksCounter === 1 ? `tarefa` : `tarefas`;

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.tasks}>
        <Image source={logoImg} />
        <View style={styles.rightContainer}>
          <Text style={styles.tasksCounter}>Você tem </Text>
          <Text style={styles.tasksCounterBold}>
            {tasksCounter} {tasksCounterText}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(true) + 16,
    paddingBottom: 60,
    height: 136,
    backgroundColor: "#0267C1",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
  },
  tasks: {
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: "row",
  },
  tasksCounter: {
    fontSize: 15,
    color: "#FFF",
    fontFamily: "Inter-Regular",
  },
  tasksCounterBold: {
    fontSize: 15,
    color: "#FFF",
    fontFamily: "Inter-Bold",
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
