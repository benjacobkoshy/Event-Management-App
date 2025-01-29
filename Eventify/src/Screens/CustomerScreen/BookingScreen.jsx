import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Text, Card } from '@ui-kitten/components';
import { AuthContext } from '../../context/AuthContext';

export default function BookingScreen() {
    const { axiosInstance } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [eventName, setEventName] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axiosInstance.get('events/booking-list/');
            if (response.data.bookings) {
                setBookings(response.data.bookings);
                // console.log(bookings);
            } else {
                setBookings([]);
            }
        } catch (error) {
            // console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Text style={styles.eventName}>{item.name}</Text>
            <Text style={styles.details}>Tickets: {item.tickets_booked}</Text>
            <Text style={styles.details}>Total Price: ₹{item.total_price}</Text>
            <Text style={styles.details}>Date: {new Date(item.booking_date).toDateString()}</Text>
            <Text style={[styles.status, item.status === 'confirmed' ? styles.confirmed : styles.canceled]}>
                {item.status.toUpperCase()}
            </Text>
        </Card>
    );

    return (
        <Layout style={styles.container}>
            <Text category="h1" style={styles.title}>Your Bookings</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#6200EE" />
            ) : bookings.length > 0 ? (
                <FlatList
                    data={bookings}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            ) : (
                <Text style={styles.noBookings}>No bookings found</Text>
            )}
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        marginBottom: 10,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FFF',
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    details: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    status: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 5,
        borderRadius: 5,
    },
    confirmed: {
        color: 'green',
        backgroundColor: '#E6FFE6',
    },
    canceled: {
        color: 'red',
        backgroundColor: '#FFE6E6',
    },
    noBookings: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
});
