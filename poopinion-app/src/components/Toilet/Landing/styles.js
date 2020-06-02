import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 50
    },
    topToilets: {
        flex: 1,
        alignSelf: 'baseline',
        marginLeft: '2.5%'
    },
    topHeader: {
        fontWeight: 'bold',
        width: '95%',
        textAlign: 'center'
    },
    bold: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    mapContainer: {
        width: '95%',
        marginHorizontal: '2.5%'
    },
    postsContainer: { 
        width: '100%' 
    }
})

export default styles