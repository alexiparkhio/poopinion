import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        width: '95%',
        marginHorizontal: '2.5%',
        marginVertical: 30
    },
    mapStyle: {
        width: '100%',
        height: 150,
        marginTop: 10,
        marginBottom: 30
    },
    locationHeader: {
        fontSize: 20
    },
    placeName: {
        fontSize: 20
    },
    header: {
        fontSize: 40,
        fontWeight: 'bold'
    },
    placeInput: {
        fontSize: 20,
        marginVertical: 10,
        borderWidth: 2,
        padding: 10,
        borderColor: 'grey',
        borderRadius: 10
    },
    uploadImage: {
        width: 200,
        resizeMode: 'contain'
    },
    options: {
        marginVertical: 15
    },
    submitButton: {
        backgroundColor: 'green',
        width: '50%',
        marginHorizontal: '25%',
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
        padding: 20,
        borderRadius: 20,
        marginVertical: 25
    },
    disabledInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    disabledLogo: {
        flex: 0.25,
        width: 60,
        height: 60,
        resizeMode: 'contain'
    },
    disabledLogoOpacity: {
        flex: 0.25,
        width: 60,
        height: 60,
        resizeMode: 'contain',
        opacity: 0.2
    },
    disabledText: {
        flex: 0.75,
        justifyContent: 'center',
    },
    disabledTextContent: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 10
    },
    questionContainer: {
        width: '100%',
        marginVertical: 15
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    question: {
        fontSize: 20
    },
    value: {
        fontWeight: 'bold',
        color: 'brown'
    },
    picker: {
        width: '40%',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
    },
    input: {
        fontSize: 15,
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 10,
        width: '100%',
        padding: 10,
        marginVertical: 15
    },
    slider: {
        width: '50%', 
        height: 40,
    },
})

export default styles