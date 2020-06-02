import React from 'react'
import { View, TouchableOpacity, Image, Linking } from 'react-native'
import styles from './styles'

function Contact() {
    return (<>
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { Linking.openURL('https://twitter.com/Krauvando_Park') }}>
                <Image style={styles.contactLogo} source={require('../../../assets/twitter.png')} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { Linking.openURL('https://github.com/alexiparkhio/skylab-bootcamp-202001/tree/develop-poopinion/staff/alex-park/poopinion') }}>
                <Image style={styles.contactLogo} source={require('../../../assets/github.png')} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { Linking.openURL('https://www.linkedin.com/in/%C3%A0lex-park-vi%C3%B1as-69a5a5a6/') }}>
                <Image style={styles.contactLogo} source={require('../../../assets/linkedin.png')} />
            </TouchableOpacity>
        </View>
    </>)
}

export default Contact