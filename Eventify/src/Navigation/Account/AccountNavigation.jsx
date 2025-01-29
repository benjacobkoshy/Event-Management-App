import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AccountScreen from '../../Screens/CustomerScreen/AccountScreen';
import AccountInfo from '../../Screens/CustomerScreen/AccountInfo';

export default function AccountNavigation() {

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name='Account Screen' component={AccountScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name='Account Info' component={AccountInfo}
        options={{
          headerShown: true,
          headerStyle:{
            backgroundColor: "#222B45"
          },
          headerTintColor: "#ccc",
        }}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})