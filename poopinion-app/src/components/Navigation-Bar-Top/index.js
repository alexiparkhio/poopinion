import React, { useState } from 'react'
import styles from './styles'
import { View, Image, TextInput, TouchableOpacity } from 'react-native'

let query

function NavigationBarTop({ goToLogin, onSubmit, onEmergency }) {
    return (<>
        <View style={styles.container}>
            <View style={styles.top}>
                <TouchableOpacity style={styles.logoutContainer} onPress={goToLogin}>
                    <Image source={require('../../../assets/logout.png')} style={styles.logout} />
                </TouchableOpacity>

                <TextInput style={styles.query} placeholder='Search a toilet' onChangeText={(text) => query = text} />

                <TouchableOpacity style={styles.searchContainer} onPress={() => {
                    onSubmit(query)
                }}>
                    <Image source={require('../../../assets/search.png')} style={styles.search} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.searchContainer} onPress={onEmergency}>
                    <Image source={require('../../../assets/emergency.png')} style={styles.search} />
                </TouchableOpacity>
            </View>
        </View>
    </>)
}

export default NavigationBarTop