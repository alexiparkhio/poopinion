import React from 'react'
import styles from './styles'
import { View, Text, Image, TouchableOpacity } from 'react-native'

function NavigationBarBottom({ goToLanding, goToFavorites, goToProfile, goToNewToilet }) {
    return (<>
        <View style={styles.container}>
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.homeContainer} onPress={goToLanding}>
                    <Image source={require('../../../assets/home.png')} style={styles.home}  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.profileContainer} onPress={goToProfile}>
                    <Image source={require('../../../assets/profile.png')} style={styles.profile}  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.favToiletsContainer} onPress={goToFavorites}>
                    <Image source={require('../../../assets/favToilets.png')} style={styles.fav}  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.newToiletContainer} onPress={goToNewToilet}>
                    <Image source={require('../../../assets/newToilet.png')} style={styles.newPost}  />
                </TouchableOpacity>
            </View>
        </View>
    </>)
}

export default NavigationBarBottom