import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    postsContainer: {
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 10,
        opacity: 0.7,
        borderWidth: 2,
        borderRadius: 15,
        borderColor: 'grey'
    },
    innerPost: {
        flexDirection: 'row',
    },
    postsLeft: {
        flex: 1
    },
    postTitle: {
        fontWeight: 'bold',
        fontSize: 20
    },
    postDate: {
        fontStyle: 'italic'
    },
    postsRight: {
        flex: 1
    },
    image: {
        width: '100%',
        height: 100,
        resizeMode: 'contain'
    }
})

export default styles