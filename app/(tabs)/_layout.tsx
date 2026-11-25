import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, layout } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="explore"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: -0.2,
          marginTop: 2,
        },
      }}
    >
      {/* 1. 지도 -> 장소와 이름만 등록 */}
      <Tabs.Screen
        name="map"
        options={{
          title: ko.tabs.map,
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: focused ? colors.accent : colors.textSecondary },
              ]}
            >
              {ko.tabs.map}
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'map' : 'map-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 2. 캘린더 -> 감독과 배우 정보 스케줄 확인 */}
      <Tabs.Screen
        name="calendar"
        options={{
          title: ko.tabs.calendar,
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: focused ? colors.accent : colors.textSecondary },
              ]}
            >
              {ko.tabs.calendar}
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 3. 탐색 (홈 느낌) -> 중앙 강조 원형 버튼, 익명 공유 장면 데이터베이스 */}
      <Tabs.Screen
        name="explore"
        options={{
          title: ko.tabs.explore,
          tabBarButton: (props) => {
            const isFocused = props.accessibilityState?.selected;
            return (
              <TouchableOpacity
                onPress={props.onPress}
                onLongPress={props.onLongPress ?? undefined}
                accessibilityState={props.accessibilityState}
                accessibilityLabel={props.accessibilityLabel}
                testID={props.testID}
                activeOpacity={0.85}
                style={styles.centerButtonContainer}
              >
                <View
                  style={[
                    styles.centerButton,
                    isFocused ? styles.centerButtonActive : styles.centerButtonInactive,
                  ]}
                >
                  <Ionicons
                    name={isFocused ? 'compass' : 'compass-outline'}
                    size={28}
                    color={isFocused ? colors.textInverse : colors.accent}
                  />
                </View>
                <Text
                  style={[
                    styles.centerTabLabel,
                    { color: isFocused ? colors.accent : colors.textSecondary },
                  ]}
                >
                  {ko.tabs.explore}
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />

      {/* 4. 서랍 -> 내가 만든것들 & 탐색에서 스크랩한 장면 */}
      <Tabs.Screen
        name="archive"
        options={{
          title: ko.tabs.archive,
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: focused ? colors.accent : colors.textSecondary },
              ]}
            >
              {ko.tabs.archive}
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* 5. 마이 -> 계정 연동 및 환경설정 */}
      <Tabs.Screen
        name="profile"
        options={{
          title: ko.tabs.profile,
          tabBarLabel: ({ focused }) => (
            <Text
              numberOfLines={1}
              style={[
                styles.tabLabel,
                { color: focused ? colors.accent : colors.textSecondary },
              ]}
            >
              {ko.tabs.profile}
            </Text>
          ),
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />

      {/* Legacy route scene-info hidden from tab bar */}
      <Tabs.Screen
        name="scene-info"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: -0.3,
    marginTop: 2,
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -12,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonActive: {
    backgroundColor: colors.accent,
    borderWidth: 2,
    borderColor: '#FDBA74',
  },
  centerButtonInactive: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 2,
    borderColor: colors.border,
  },
  centerTabLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
});
