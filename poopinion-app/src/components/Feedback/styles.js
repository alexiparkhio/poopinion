import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    msg: {
        fontSize: 20,
        padding: 5,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    warning: {
        color: 'orange'
    },
    error: {
        color: 'red'
    }
})

export default styles