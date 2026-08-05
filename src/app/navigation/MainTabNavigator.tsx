import { StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors, spacing, typography } from '@/common/styles/theme';

import { CalendarScreen } from '@/domain/calendar/screens/CalendarScreen';
import { HomeScreen } from '@/domain/meeting/screens/HomeScreen';
import { MyScreen } from '@/domain/user/screens/MyScreen';

export type MainTabParamList = {
  Home: undefined;
  Calendar: undefined;
  My: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Calendar: 'calendar',
  My: 'person',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons
            name={focused ? TAB_ICONS[route.name] : (`${TAB_ICONS[route.name]}-outline` as keyof typeof Ionicons.glyphMap)}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: '캘린더' }} />
      <Tab.Screen name="My" component={MyScreen} options={{ tabBarLabel: '마이' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 82,
    paddingTop: spacing.sm,
    borderTopColor: colors.border,
  },
  tabBarLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
  },
});
