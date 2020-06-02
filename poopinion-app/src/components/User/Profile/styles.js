import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 30,
        width: '95%',
        marginHorizontal: '2.5%'
    },
    nameHeader: {
        flex: 1,
        flexDirection: 'row'
    },
    profilePic: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    picture: {
        flex: 1,
        padding: 0,
        marginRight: 15,
        borderRadius: 50
    },
    nameInfo: {
        flex: 3,
        flexDirection: 'column',
    },
    bold: {
        fontWeight: 'bold',
        fontSize: 20
    },
    font: {
        fontSize: 15
    },
    posts: {
        marginVertical: 30
    }, 
    comments: {
        marginVertical: 30
    },
    bigText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    separator: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        marginVertical: 5,
    },
    navContainer: {
        marginTop: 15
    },
    navButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    navButtonText: {
        fontSize: 20
    }
})

export default styles