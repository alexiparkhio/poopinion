import React from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import styles from './styles'

function PostScore({ toilet, onComment, globalRating }) {
    return (<>
        <Text style={styles.score}>Score:</Text>
        <View style={styles.allScoreInfo}>
            <View style={styles.scoreLeft}>
                <View style={styles.scoreLeftUp}>
                    <Text style={styles.scoreMean}>{toilet.score ? toilet.score : 0}</Text>
                </View>
                <TouchableOpacity style={styles.scoreLeftDown} onPress={() => onComment(toilet.id)}>
                    <Text style={styles.addRating}>+ Add/
                                    update a rating</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.scoreRight}>
                <Text>Cleanness: <Text style={styles.smallScore}>{globalRating.cleannessMean}</Text></Text>
                <Text>Aesthetics: <Text style={styles.smallScore}>{globalRating.looksMean}</Text></Text>
                <Text>Payment required: {globalRating.paymentMean >= 0.5 ? (<Text style={styles.smallScore}>Yes</Text>) : (<Text style={styles.smallScore}>No</Text>)}</Text>
                <Text>Multiple toilets: {globalRating.multipleMean >= 0.5 ? (<Text style={styles.smallScore}>Yes</Text>) : (<Text style={styles.smallScore}>No</Text>)}</Text>
                <Text>Paper provision: {globalRating.paperMean >= 0.5 ? (<Text style={styles.smallScore}>Yes</Text>) : (<Text style={styles.smallScore}>No</Text>)}</Text>
                <View style={styles.disabledContent}>
                    <Text>Disabled toilet: </Text>
                    {toilet.disabledToilet ? (<Image source={require('../../../../assets/wheelchair.png')} style={styles.disabledLogo} />)
                        :
                        (<Image source={require('../../../../assets/wheelchair.png')} style={styles.disabledLogoOpacity} />)}
                </View>
            </View>
        </View>
    </>)
}

export default PostScore