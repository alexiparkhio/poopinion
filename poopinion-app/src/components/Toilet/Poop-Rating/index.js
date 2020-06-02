import React from 'react'
import { View, Image, Text } from 'react-native'
import styles from './styles'

function PoopRating({ toilet }) {
    return (<>
        {toilet.score >= 4.5 && (<>
            <View style={styles.poopRating}>
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Text style={styles.rating}>({toilet.comments.length})</Text>
            </View>
        </>)}

        {toilet.score >= 3.5 && toilet.score < 4.5 && (<>
            <View style={styles.poopRating}>
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Text style={styles.rating}>({toilet.comments.length})</Text>
            </View>
        </>)}

        {toilet.score >= 2.5 && toilet.score < 3.5 && (<>
            <View style={styles.poopRating}>
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Text style={styles.rating}>({toilet.comments.length})</Text>
            </View>
        </>)}

        {toilet.score >= 1.5 && toilet.score < 2.5 && (<>
            <View style={styles.poopRating}>
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Text style={styles.rating}>({toilet.comments.length})</Text>
            </View>
        </>)}

        {toilet.score >= 0.5 && toilet.score < 1.5 && (<>
            <View style={styles.poopRating}>
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRating.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Text style={styles.rating}>({toilet.comments.length})</Text>
            </View>
        </>)}

        {toilet.score < 0.5 && (<>
            <View style={styles.poopRating}>
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Image style={styles.smallPoop} source={require('../../../../assets/poopRatingNot.png')} />
                <Text style={styles.rating}>({toilet.comments.length})</Text>
            </View>
        </>)}
    </>)
}

export default PoopRating