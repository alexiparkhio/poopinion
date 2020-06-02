import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    posts: {
        flex: 1,
        flexDirection: 'column',
        width: '100%',
    },
    post: {
        width: '95%',
        marginHorizontal: '2.5%',
        marginVertical: '4%',
    },
    header: {
        flex: 1,
        flexDirection: 'row'
    },
    image: {
        width: '100%',
        height: 200
    },
    postContent: {
        flex: 1,
        flexDirection: 'row',
    },
    contentLeft: {
        flex: 1,
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'column'
    },
    left: {
        fontSize: 18,
    },
    contentRight: {
        flex: 0.25,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    right: {
        fontSize: 30
    },
    mapStyle: {
        width: '95%',
        height: 150,
        marginVertical: 10
    },
    headerRight: {
        flex: 0.25
    },
    postedAt: {
        fontStyle: 'italic'
    },
    place: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})

export default styles