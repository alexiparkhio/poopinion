import React, { useState, useEffect } from 'react'
import styles from './styles'
import { View, ScrollView, Slider, Text, SafeAreaView, Image, TouchableOpacity, FlatList } from 'react-native'
import MapView, { Marker, Circle } from 'react-native-maps'
import { MapCallout } from '../'
import { isPointWithinRadius } from 'geolib'

function EmergencyMap({ coordinates, topToilets, onDetails, user }) {
    const [radius, setRadius] = useState(400)
    const [score, setScore] = useState(0)
    const [zoom, setZoom] = useState(0.010)

    useEffect(() => { }, [radius])
    useEffect(() => { }, [score])

    return (<>
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <MapView style={styles.mapStyle}
                    region={{
                        latitude: coordinates.latitude,
                        longitude: coordinates.longitude,
                        latitudeDelta: zoom,
                        longitudeDelta: zoom,
                    }}>

                    <Circle
                        center={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
                        radius={radius}
                        strokeWidth={1}
                        strokeColor={'#1a66ff'}
                        fillColor={'rgba(230,238,255,0.6)'}
                    />

                    <Marker
                        coordinate={{
                            latitude: coordinates.latitude,
                            longitude: coordinates.longitude
                        }}
                        title={user ? `This is you, ${user.name}!` : 'This is you!'}
                        pinColor={'lightblue'}
                    />

                    {/* {topToilets && (<>
                        <FlatList
                            style={{ flex: 1 }}
                            data={topToilets}
                            renderItem={({ item }) => {
                                isPointWithinRadius({ latitude: coordinates.latitude, longitude: coordinates.longitude },
                                    { latitude: item.geolocation.latitude, longitude: item.geolocation.longitude },
                                    radius) && item.score > score && (<>
                                        <View style={{ flex: 1 }}>
                                            <MapCallout toilet={item} onDetails={onDetails} />
                                        </View>
                                    </>)
                            }} />
                    </>)} */}
                    {topToilets && topToilets.map(toilet => (<>
                        {isPointWithinRadius({ latitude: coordinates.latitude, longitude: coordinates.longitude },
                            { latitude: toilet.geolocation.latitude, longitude: toilet.geolocation.longitude },
                            radius) && toilet.score > score && (<>
                                <MapCallout toilet={toilet} onDetails={onDetails} />
                            </>)}
                    </>))}
                </MapView>

                <View style={styles.buttonContainer}>
                    <View style={styles.radiusLength}>
                        <TouchableOpacity onPress={(event) => {
                            event.preventDefault()
                            setZoom(0.005)
                            setRadius(200)
                        }}
                            style={styles.buttonMargin}>
                            <Text style={styles.button}>S</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={(event) => {
                            event.preventDefault()
                            setZoom(0.010)
                            setRadius(400)
                        }}
                            style={styles.buttonMargin}>
                            <Text style={styles.button}>M</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={(event) => {
                            event.preventDefault()
                            setZoom(0.015)
                            setRadius(600)
                        }}>
                            <Text style={styles.button}>L</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text style={styles.bold}>Minimum Score ({parseFloat(score.toFixed(2))})</Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => setScore(parseFloat(value))}
                            />
                            <Text>5</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.windowInfo}>
                    <Text style={styles.textInfo}>{`This is the Emergency Map! Use this to find nearby toilets based on the level of your emergency (smaller/bigger radius) and the mean score of said toilets.\n\nYou can click on the markers to find info about the toilet and click on it go to the toilet post`}</Text>
                </View>
            </SafeAreaView>
        </ScrollView>
    </>)
}

export default EmergencyMap