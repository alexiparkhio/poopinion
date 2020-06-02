import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '100%'
    },
    infoContainer: {
        width: '95%',
        marginHorizontal: '2.5%'
    },
    scoreContainer: {
        width: '100%',
        marginVertical: 15
    },
    mapContainer: {
        width: '100%',
        marginVertical: 15
    },
    
    image: {
        width: '100%',
        height: 200
    },
    header: {
        flex: 1,
        flexDirection: 'row'
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'column'
    },
    headerRight: {
        flex: 0.25
    },
    favButton: {
        resizeMode: 'contain',
        width: '60%',
        height: '60%',
        alignSelf: 'center'
    },
    place: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    poopRating: {
        height: 30
    },
    postedAt: {
        fontStyle: 'italic'
    },
    location: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    comments: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    commentsContainer: {
        marginTop: 15,
        marginBottom: 40
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 10,
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white',
        marginBottom: 15,
        textAlign: 'center'
    }
})

export default styles