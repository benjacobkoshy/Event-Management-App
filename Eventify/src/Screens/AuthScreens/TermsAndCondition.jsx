import React from 'react';
import { Button, Layout, Text } from '@ui-kitten/components';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function TermsAndCondition({ navigation }) {
  return (
    <Layout style={styles.container}>
      <Text category="h1" style={styles.header}>
        Terms and Conditions
      </Text>
      <ScrollView style={styles.scrollContainer}>
        <Text category="p1" style={styles.text}>
          Welcome to our Event Management App! By accessing or using this app, you agree to the following terms and conditions:
        </Text>
        <Text category="s1" style={styles.subHeader}>1. General Usage</Text>
        <Text category="p2" style={styles.text}>
          You agree to use this app responsibly and not to engage in any activities that may harm the platform or its users.
        </Text>
        <Text category="s1" style={styles.subHeader}>2. Data Privacy</Text>
        <Text category="p2" style={styles.text}>
          Your data will be collected and used in accordance with our privacy policy. We ensure your data's confidentiality.
        </Text>
        <Text category="s1" style={styles.subHeader}>3. Booking Policies</Text>
        <Text category="p2" style={styles.text}>
          All bookings are subject to availability. Cancellation policies may vary based on the event organizer.
        </Text>
        <Text category="s1" style={styles.subHeader}>4. Limitation of Liability</Text>
        <Text category="p2" style={styles.text}>
          We are not liable for any damages arising from the use of this app beyond the extent permitted by law.
        </Text>
        <Text category="s1" style={styles.subHeader}>5. Updates to Terms</Text>
        <Text category="p2" style={styles.text}>
          These terms may be updated periodically. Continued use of the app constitutes your acceptance of any changes.
        </Text>
        <Text category="p1" style={styles.text}>
          If you have any questions about these terms, please contact us via the support section of the app.
        </Text>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={() => navigation.goBack()}>
          Accept
        </Button>
        <Button
          style={[styles.button, styles.declineButton]}
          appearance="outline"
          onPress={() => navigation.goBack()}
        >
          Decline
        </Button>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: '#f7f9fc',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  subHeader: {
    marginTop: 15,
    fontWeight: 'bold',
  },
  text: {
    marginTop: 10,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  declineButton: {
    borderColor: '#3366FF',
  },
});
