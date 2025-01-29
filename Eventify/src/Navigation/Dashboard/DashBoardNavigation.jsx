import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import DashboardScreen from '../../Screens/OrganizerScreens/DashboardScreen'
import AddEventScreen from '../../Screens/OrganizerScreens/AddEventScreen'
import ViewAllEventsScreen from '../../Screens/OrganizerScreens/ViewAllEventsScreen';

export default function DashBoardNavigation() {

    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator>
        <Stack.Screen name='Dashboard Screen' component={DashboardScreen} 
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen name='Add Event' component={AddEventScreen} 
            options={{
              headerStyle: {
                backgroundColor: "#222B45"
              },
              headerTintColor: "#fff"
            }}
        />
        <Stack.Screen name='All Events' component={ViewAllEventsScreen} 
          options={{
            headerStyle: {
              backgroundColor: "#222B45"
            },
            headerTintColor: "#fff"
        }}
        />
        
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})