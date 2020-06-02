import React from 'react'
import styles from './styles'
import moment from 'moment'
import { View, Text, Image } from 'react-native'
import { Marker, Callout } from 'react-native-maps'


function MapCallout({ toilet, onDetails }) {
    return (<>
        <Marker
            coordinate={{
                latitude: toilet.geolocation.latitude,
                longitude: toilet.geolocation.longitude,
            }}
        >
            <Callout onPress={() => onDetails(toilet.id.toString())}>
                <View style={styles.calloutContainer}>
                    <Text style={styles.centerText}>
                        {toilet.image ? (<>
                            <Image
                                source={{ uri: toilet.image }}
                                style={styles.calloutImage}
                            />
                        </>) : (<>
                            <Image
                                source={require('../../../../assets/placeholder.jpg')}
                                style={styles.calloutImage}
                            />
                        </>)}
                    </Text>
                    <Text style={styles.calloutTitle}>{toilet.place}</Text>
                    <Text><Text style={styles.bold}>Publisher</Text>: {toilet.publisher.name} {toilet.publisher.surname}</Text>
                    <Text><Text style={styles.bold}>Published at</Text>: {moment(toilet.created).fromNow()}</Text>
                    <Text><Text style={styles.bold}>Score</Text>: {toilet.score} ({toilet.comments.length})</Text>
                </View>
            </Callout>
        </Marker>

    </>)
}

export default MapCallout