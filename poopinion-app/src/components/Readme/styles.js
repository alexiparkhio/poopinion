import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '95%',
        height: Dimensions.get('window').height,
        marginHorizontal: '2.5%',
        marginTop: 10,
    },
    imageHeader: {
        width: '100%',
        resizeMode: 'contain'
    },
    mainContainer: {
        flex: 1
    },
    navContainer: {
        flex: 0.10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    pageNav: {
        flex: 0.7,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    backButton: {
        flex: 0.3
    },
    pageNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10
    },
    navButtonImage: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    button: {
        color: 'white',
        fontSize: 20,
        padding: 10,
        borderRadius: 10,
        fontWeight: 'bold',
        backgroundColor: '#df7861',
        textAlign: 'center'
    },
    navButton: {
        padding: 10
    },  
    mainContainer: {
        flex: 1,
        padding: 10
    },
    textHeader: {
        color: 'brown',
        fontSize: 30, 
        fontWeight: 'bold',
        marginBottom: 10
    },
    textContent: {
        fontSize: 16,
        marginBottom: 10,
        lineHeight: 30
    }
})

export default styles