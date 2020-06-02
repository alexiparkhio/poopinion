import React from 'react'
import { Text, View } from 'react-native'
import styles from './styles'

function Feedback({ level, message }) {
    return (<>
        <View style={styles.container}>
            {level === 'warn' && <Text style={[styles.msg, styles.warning]}>🚽 {message} 🚽</Text>}
            {level === 'error' && <Text style={[styles.msg, styles.error]}>🚽 {message} 🚽</Text>}
        </View>
    </>)
}

export default Feedback