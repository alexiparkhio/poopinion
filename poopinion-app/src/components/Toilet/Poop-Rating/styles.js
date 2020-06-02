import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    smallPoop: {
        flex: 1,
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
        alignSelf: 'flex-start'
    },
    poopRating: {
        flex: 1,
        width: '70%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    rating: {
        alignSelf: 'center'
    }
})

export default styles