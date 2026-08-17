import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { GameSummaryScreen } from "../screens/GameSummaryScreen";
import { PlayerProfileScreen } from "../screens/PlayerProfileScreen";
import { AwardsScreen } from "../screens/AwardsScreen";
import { CompetitionsScreen } from "../screens/CompetitionsScreen";

export type RootStackParamList = {
  Home: undefined;
  GameSummary: { gameId: string };
  PlayerProfile: { playerId: string };
  Awards: undefined;
  Competitions: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: "#0B1220", card: "#0B1220" },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#0B1220" }, headerTintColor: "#FFFFFF" }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Games" }} />
        <Stack.Screen name="GameSummary" component={GameSummaryScreen} options={{ title: "Game Summary" }} />
        <Stack.Screen name="PlayerProfile" component={PlayerProfileScreen} options={{ title: "Player" }} />
        <Stack.Screen name="Awards" component={AwardsScreen} options={{ title: "Awards" }} />
        <Stack.Screen name="Competitions" component={CompetitionsScreen} options={{ title: "Competitions" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
