import { StyleSheet, Dimensions } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 0.08,
        height: Dimensions.get('window').height
    },
    top: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingBottom: 5,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.9,
        shadowRadius: 1.84,
        elevation: 10,
    },
    logoutContainer: {
        flex: 0.25,
        padding: 10
    },
    searchContainer: {
        flex: 0.25,
        padding: 10
    },
    logout: {
        flex: 1,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    query: {
        flex: 0.5,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: 'lightgray',
        padding: 5
    },
    search: {
        flex: 1,
        resizeMode: 'contain',
        alignSelf: 'center'
    }
})

export default styles