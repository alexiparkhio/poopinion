import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        marginVertical: 30
    },
    headerContainer: {
        flex: 1,
        marginVertical: 0,
        marginHorizontal: '2.5%'
    },
    header: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    favsContainer: {
        flex: 1,
        marginVertical: 15
    },
    noFavs: {
        marginHorizontal: '2.5%'
    }
})

export default styles