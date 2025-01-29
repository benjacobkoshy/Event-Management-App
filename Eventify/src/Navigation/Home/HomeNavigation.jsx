import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from '../../Screens/CustomerScreen/HomeScreen'
import EventDetailsScreen from '../../Screens/CustomerScreen/EventDetailsScreen'
import PaymentScreen from '../../Screens/Payment/PaymentScreen'
import PaymentStatusScreen from '../../Screens/Payment/PaymentStatusScreen'

export default function HomeNavigation() {

    const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator>
        <Stack.Screen name='Home Screen' component={HomeScreen}
            options={{
                headerShown: false
            }}
        />
        <Stack.Screen name='Event Details' component={EventDetailsScreen}
            options={{
              headerStyle: {
                backgroundColor: "#222B45",
              },
              headerTintColor: "#fff",
            }}
        />
        <Stack.Screen name='Payment Screen' component={PaymentScreen} 
            options={{
                headerShown: false
            }}
        />

        <Stack.Screen name='Payment Status' component={PaymentStatusScreen} 
             options={{
              headerShown: false,
            }}
        />
        
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})