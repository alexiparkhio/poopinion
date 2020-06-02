import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native'
import styles from './styles'
import moment from 'moment'

function LastComments({ comment, onDetails }) {
    const [commentLoading, setCommentLoading] = useState(undefined)

    return (<>
        <TouchableOpacity onPress={() => {
            setCommentLoading(comment.id)
            onDetails(comment.commentedAt.toString())
        }} style={styles.postsContainer}>
            <View style={styles.innerPost}>
                <View style={styles.postsLeftComment}>
                    <Text>"{comment.rating.textArea.length > 0 ? (<Text style={styles.commentText}>{comment.rating.textArea}</Text>) : (<Text>(No text comment added)</Text>)}"</Text>
                    <Text style={styles.postDate}>Posted {moment(comment.created).fromNow()}</Text>
                    <View style={styles.innerPost}>
                        <View style={styles.innerPost}>
                            <Image source={require('../../../../assets/thumb-up.png')} style={styles.thumb} /><Text></Text>
                            <Text style={styles.thumbCount}>: {comment.thumbsUp.length}</Text>
                        </View>

                        <View style={styles.innerPost}>
                            <Image source={require('../../../../assets/thumb-down.png')} style={styles.thumb} /><Text></Text>
                            <Text style={styles.thumbCount}>: {comment.thumbsDown.length}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.postsRight}>
                    <Text style={styles.postTitle}>Toilet's score: {comment.rating.overallRating}</Text>
                    <Text>Cleanness: {comment.rating.cleanness}</Text>
                    <Text>Aesthetics: {comment.rating.looks}</Text>
                    <Text>Payment required: {comment.rating.paymentRequired > 0 ? (<Text>Yes</Text>) : (<Text>No</Text>)}</Text>
                    <Text>Multiple toilets: {comment.rating.multipleToilets > 0 ? (<Text>Yes</Text>) : (<Text>No</Text>)}</Text>
                    <Text>Paper provision: {comment.rating.paperDeployment > 0 ? (<Text>Yes</Text>) : (<Text>No</Text>)}</Text>
                </View>
            </View>
        </TouchableOpacity>
        {commentLoading === comment.id && (<>
            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Submit loading, please don't press anything...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </>)}
    </>)
}

export default LastComments