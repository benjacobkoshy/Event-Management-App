import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Layout, Text, Icon } from '@ui-kitten/components';

export default function AccountScreen({ navigation }) {
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
    }

  return (
    <Layout style={styles.container}>
      <Text category='h1'>Account</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('Account Info')}>
          <Text style={styles.buttonText}>Account</Text>
          <Icon name="person" fill="#ccc" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      </View>
      
    </Layout>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
      }, 
      buttonContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1
      },  
      button: {
          borderWidth: 1,
          borderColor: "#fff",
          width: 200,
          height: 40,
          justifyContent: "center",
          borderRadius: 7,
          marginTop: 20,
          flexDirection: "row"
      },
      logoutButton: {
        borderWidth: 1,
          borderColor: "#fff",
          width: 100,
          height: 40,
          justifyContent: "center",
          borderRadius: 7,
          marginTop: 20
      },  
      buttonText: {
        alignSelf: "center",
        color: "#fff",
      },
      icon: {
        width: 30,
        height: 30,
        marginLeft: 5,
      }
})