import { StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    score: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    allScoreInfo: {
        flexDirection: 'row'
    },
    scoreLeft: {
        margin: 15,
        justifyContent: 'center',
        flexDirection: 'column',
        flex: 0.8
    },
    scoreLeftUp: {
        flex: 2,
        borderWidth: 5,
        borderColor: '#df7861',
        width: '100%',
        marginBottom: 10,
        borderRadius: 50,
        alignContent: 'center',
        justifyContent: 'center'
    },
    scoreMean: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#df7861',
        textAlign: 'center',
    },
    scoreLeftDown: {
        flex: 1
    },
    addRating: {
        backgroundColor: '#df7861',
        padding: 10,
        borderRadius: 10,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    scoreRight: {
        margin: 15,
        justifyContent: 'space-around'
    },
    smallScore: {
        fontWeight: 'bold',
        fontSize: 18
    },
    disabledContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    disabledLogo: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    disabledLogoOpacity: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        opacity: 0.2
    }
})

export default styles