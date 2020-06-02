import {StyleSheet} from 'react-native'

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
    commentText: {
        fontStyle: 'italic',
        fontSize: 18
    },
    postsLeftComment: {
        flex: 1,
        justifyContent: 'center'
    },
    thumb: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 5
    },
    thumbCount: {
        alignSelf: 'center',
        marginRight: 15
    },
    postsRight: {
        flex: 1
    },
    postTitle: {
        fontWeight: 'bold',
        fontSize: 20
    }
})

export default styles