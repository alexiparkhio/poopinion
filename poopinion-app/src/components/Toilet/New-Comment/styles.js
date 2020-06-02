import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '95%',
        flexDirection: 'column',
        marginHorizontal: '2.5%'
    },
    image: {
        width: '100%',
        height: 200
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 15
    },
    italic: {
        fontStyle: 'italic'
    },
    slider: {
        width: '50%', 
        height: 40,
    },
    questionContainer: {
        width: '100%',
        marginVertical: 15
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center'
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
    submit: {
        padding: 20,
        backgroundColor: '#df7861',
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        width: '50%',
        marginHorizontal: '25%',
        borderRadius: 20,
        marginBottom: 15 
    }
})

export default styles