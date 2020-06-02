import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '90%',
        flexDirection: 'column',
        marginTop: 100,
        marginHorizontal: '5%'
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    form: {
        fontSize: 20
    },
    error: {
        textAlign: 'center',
        fontSize: 30,
        color: 'red'
    },
    navButtons: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    form: {
        fontSize: 20,
        marginVertical: 10,
        borderWidth: 2,
        padding: 10,
        borderColor: 'grey',
        borderRadius: 10
    },
    genderPicker: {
        fontSize: 20
    },
    button: {
        color: 'white',
        fontWeight: 'bold',
        marginVertical: 20,
        backgroundColor: 'brown',
        padding: 20,
        overflow: 'hidden',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20
    },
    left: {
        flex: 1,
        marginRight: 5
    },
    right: {
        flex: 1.5,
        marginLeft: 5
    },
    leftButton: {
        backgroundColor: '#df7861',
        textAlign: 'center',
        padding: 15,
        borderRadius: 10,
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white'
    },
    rightButton: {
        backgroundColor: '#df7861',
        textAlign: 'center',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white'
    }
})

export default styles