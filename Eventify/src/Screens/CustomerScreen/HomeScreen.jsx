import React, { useState, useEffect, useContext } from 'react';
import { Input, Layout, Text, Card, Icon, Button } from '@ui-kitten/components';
import { StyleSheet, ScrollView, View, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {

  const { axiosInstance } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [featuredEvent, setFeaturedEvent] = useState(null); // State for featured event
  const [loading, setLoading] = useState(false);

  // Fetch events when component mounts or search query changes
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/events/events/', {
          params: { name: searchQuery },  // You can add more filters here if needed
        });
        const eventsData = response.data;
        // console.log(response.data);
        setEvents(eventsData);

        // console.log(eventsData)

        // Find the featured event (event with highest attendees)
        if (eventsData.length > 0) {
          const highestAttendedEvent = eventsData.reduce((max, event) =>
            event.attendees > max.attendees ? event : max
          );
          setFeaturedEvent(highestAttendedEvent); // Set the featured event
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery]);  // Re-fetch when search query changes

  const handleSearch = () => {
    // The fetch is automatically triggered by the useEffect hook when searchQuery changes
    console.log('Searching for:', searchQuery);
  };

  return (
    <Layout style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Text category="h1" style={styles.headerText}>Discover Events</Text>
          <View style={styles.filterContainer}>
            <Icon style={styles.icon} fill="#8F9BB3" name="funnel-outline" />
            <Text style={styles.filterText}>Filter by category</Text>
            <Button size="small" appearance="ghost" onPress={() => console.log('Filter pressed')}>
              Filter
            </Button>
          </View>
          <Input
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            accessoryRight={(props) => (
              <TouchableOpacity onPress={handleSearch}>
                <Icon {...props} name="search-outline" />
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Featured Event Section */}
        <Text category="h4" style={styles.sectionHeader}>Featured Event</Text>
        {featuredEvent ? (
          <Card style={styles.featuredCard}>
            <Image source={{ uri: featuredEvent.image_url }} style={styles.featuredImage} />
            <Text category="h5" style={styles.cardTitle}>{featuredEvent.name}</Text>
            <Text style={styles.cardText}>{featuredEvent.description}</Text>
            <Text style={styles.cardDate}>{featuredEvent.start_date}</Text>
            <View style={styles.cardFooter}>
              <Button size="small" onPress={() => navigation.navigate('Event Details', { eventId: featuredEvent.id })}>
                Details
              </Button>
            </View>
          </Card>
        ) : (
          <Text>Loading featured event...</Text>
        )}

        {/* Other Events Section */}
        <Text category="h4" style={styles.sectionHeader}>Other Events</Text>
        {loading ? (
          <Text>Loading events...</Text>
        ) : (
          events.map((event) => (
            <Card key={event.id} style={styles.eventCard}>
              <Image source={{ uri: event.image_url }} style={styles.eventImage} />
              <Text category="s1" style={styles.cardTitle}>{event.name}</Text>
              <Text style={styles.cardText}>{event.description}</Text>
              <Text style={styles.cardDate}>{event.start_date}</Text>
              <View style={styles.cardFooter}>
                <Button size="small" appearance="ghost" onPress={() => navigation.navigate('Event Details', { eventId: event.id })}>
                  Details
                </Button>
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerText: {
    marginBottom: 10,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  filterText: {
    flex: 1,
    marginLeft: 10,
    color: '#8F9BB3',
  },
  searchInput: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginVertical: 10,
  },
  featuredCard: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 2,
    borderColor: '#3366FF',
  },
  featuredImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventCard: {
    marginBottom: 20,
    padding: 15,
  },
  eventImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
  },
  cardText: {
    marginVertical: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    color: '#8F9BB3',
    fontSize: 12,
  },
});

export default HomeScreen;
