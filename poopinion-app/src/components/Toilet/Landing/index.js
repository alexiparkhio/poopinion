import React from 'react'
import { View, ScrollView, Text, FlatList } from 'react-native'
import styles from './styles'
import { Post } from '../'
import { LocationMap } from '../../Geolocation'

function Landing({ user, coordinates, topToilets, onFav, onDetails }) {
    return (<>
        <ScrollView>
            <View style={styles.container}>
                {user ? (<Text style={styles.topHeader}>Welcome, {user.name} {user.surname}!! Enjoy your pooping 🚽</Text>)
                    :
                    (<Text style={styles.topHeader}>🚽 Welcome, stranger!! Enjoy your pooping 🚽</Text>)}
                <Text>Your current position is: </Text>

                {coordinates.latitude && coordinates.longitude && (<>
                    <View style={styles.mapContainer}>
                        <LocationMap target={coordinates} user={user} />
                    </View>
                </>)}

                <View style={styles.topToilets}>
                    <Text style={styles.bold}>Top Toilets</Text>
                </View>

                {topToilets.length > 0 && (<>
                    <FlatList
                        data={topToilets}
                        style={styles.postsContainer}
                        renderItem={({ item }) => {
                            return <Post user={user} toilet={item} onDetails={onDetails} onFav={onFav} />
                        }}
                    />
                </>)}
            </View>

            <View><Text>© All rights reserved to Àlex Park Viñas</Text></View>
        </ScrollView>
    </>)
}

export default Landing