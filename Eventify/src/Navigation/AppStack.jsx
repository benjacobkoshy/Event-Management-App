import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@ui-kitten/components';

import { AuthContext } from '../context/AuthContext';
import HomeNavigation from './Home/HomeNavigation';
import DashBoardNavigation from './Dashboard/DashBoardNavigation';
import AccountNavigation from './Account/AccountNavigation';
import BookingNavigation from './Bookings/BookingNavigation';

const Tab = createBottomTabNavigator();

export default function AppStack() {

  const { role } = useContext(AuthContext);


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide the header for all screens
        tabBarStyle: { backgroundColor: '#222B45' }, // Dark theme for the tab bar
        tabBarActiveTintColor: '#007bff', // Color for the active tab
        tabBarInactiveTintColor: '#ccc', // Color for the inactive tabs
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Dashboard ') {
            iconName = focused ? 'layout' : 'layout-outline';
          }else if (route.name === 'Account') {
            iconName = focused ? 'person' : 'person-outline';
          }else if (route.name === 'Booking') {
            iconName = focused ? 'book' : 'book-outline';
          }


          return <Icon name={iconName} fill={focused ? '#007bff' : '#ccc'} style={styles.icon} />;
        },
        tabBarLabel: ({ focused }) => (
          <Text style={{ fontSize: 10, color: focused ? '#007bff' : '#ccc' }}>
            {route.name}
          </Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigation} />
      {role === 'organizer' && <Tab.Screen name="Dashboard " component={DashBoardNavigation} />}

      <Tab.Screen name="Booking" component={BookingNavigation} />
      <Tab.Screen name="Account" component={AccountNavigation} />
      
      
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});
