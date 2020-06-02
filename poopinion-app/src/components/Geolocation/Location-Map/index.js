import React from 'react'
import MapView, { Marker } from 'react-native-maps'
import styles from './styles'

function LocationMap({ target, user }) {
    return (<>
        <MapView style={styles.container}
            region={{
                latitude: target.latitude,
                longitude: target.longitude,
                latitudeDelta: target.latitudeDelta,
                longitudeDelta: target.longitudeDelta,
            }}>
            <Marker
                coordinate={{
                    latitude: target.latitude,
                    longitude: target.longitude
                }}
                title={user ? `This is you, ${user.name}!` : ''}
                pinColor={user ? 'lightblue' : ''}
            />
        </MapView>
    </>)
}

export default LocationMap