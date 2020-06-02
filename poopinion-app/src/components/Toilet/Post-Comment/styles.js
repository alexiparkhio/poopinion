import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    commentContainer: {
        marginVertical: 15,
        borderWidth: 2,
        borderColor: 'grey',
        borderRadius: 15,
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.7)'
    },
    commentTop: {
        flexDirection: 'row'
    },
    commentTopLeft: {
        flex: 1
    },
    commentPublisher: {
        fontWeight: 'bold'
    },
    profilePic: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        paddingHorizontal: 15,
    },
    commentCreated: {
        fontStyle: 'italic'
    },
    commentTopRight: {
        flex: 1,
        alignSelf: 'center',
    },
    commentTopRightText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        borderWidth: 1,
        borderColor: 'lightgrey',
        borderRadius: 10
    },
    userInfo: {
        paddingVertical: 10
    },
    bold: {
        fontWeight: 'bold'
    },
    separator: {
        borderBottomColor: 'lightgrey',
        borderBottomWidth: 2,
        marginVertical: 5,
    },
    commentItself: {
        marginTop: 25
    },
    theComment: {
        fontStyle: 'italic'
    },
    thumbs: {
        flexDirection: 'row',
        margin: 10
    },
    thumbUp: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 10
    },
    thumbDown: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginHorizontal: 10
    },
    thumbUpContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center'
    },
    thumbDownContainer: {
        flexDirection: 'row',
        marginHorizontal: 10,
        alignItems: 'center'
    },
    trashContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'flex-end',
    },
    trash: {
        width: 40,
        height: 40,
        resizeMode: 'contain',

    }
})

export default styles