import React, { useState } from 'react'
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import moment from 'moment'
import styles from './styles'

function PostComment({ user, comment, onDelete, onThumbDown, onThumbUp, toilet }) {
    const [userInfo, setUserInfo] = useState()

    return (<>
        <View style={styles.commentContainer}>
            <View style={styles.commentTop}>
                <View style={styles.commentTopLeft}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text onPress={() => {
                            userInfo === comment.publisher._id.toString() ? setUserInfo(undefined) : setUserInfo(comment.publisher._id.toString())
                        }}>By: <Text style={styles.commentPublisher}>{comment.publisher.name} {comment.publisher.surname}</Text></Text>
                        {comment.publisher.publishedToilets.length < 5 && comment.publisher.comments.length < 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_bronze.png')} />}
                        {comment.publisher.publishedToilets.length < 5 && comment.publisher.comments.length >= 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_bronze_pro.png')} />}

                        {comment.publisher.publishedToilets.length >= 5 && comment.publisher.publishedToilets.length < 10 && comment.publisher.comments.length < 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_silver.png')} />}
                        {comment.publisher.publishedToilets.length >= 5 && comment.publisher.publishedToilets.length < 10 && comment.publisher.comments.length >= 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_silver_pro.png')} />}

                        {comment.publisher.publishedToilets.length >= 10 && comment.publisher.comments.length < 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_gold.png')} />}
                        {comment.publisher.publishedToilets.length >= 10 && comment.publisher.comments.length >= 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_gold_pro.png')} />}
                    </View>
                    <Text style={styles.commentCreated}>Posted {moment(comment.created).fromNow()}</Text>
                </View>
                <View style={styles.commentTopRight}>
                    <Text style={styles.commentTopRightText}>Rating: <Text style={{ fontStyle: 'italic' }}>{parseFloat((comment.rating.overallRating * 0.5 + comment.rating.cleanness * 0.25 + comment.rating.looks * 0.25).toFixed(2))}</Text><Text style={{ fontStyle: 'italic' }}>/5</Text></Text>

                </View>
            </View>

            {userInfo === comment.publisher._id.toString() && (<>
                <View style={styles.userInfo}>
                    <View
                        style={styles.separator}
                    />
                    <Text><Text style={styles.bold}>Age</Text>: {moment().diff(comment.publisher.age, 'years')} years</Text>
                    <Text><Text style={styles.bold}>Gender</Text>: {comment.publisher.gender}</Text>
                    <Text><Text style={styles.bold}>Email</Text>: {comment.publisher.email}</Text>
                    <Text><Text style={styles.bold}>Total Posts</Text>: {comment.publisher.publishedToilets.length}</Text>
                    <Text><Text style={styles.bold}>Total Comments</Text>: {comment.publisher.comments.length}</Text>
                    <Text><Text style={styles.bold}>User since</Text>: {moment(comment.publisher.created).fromNow()}</Text>
                    <View
                        style={styles.separator}
                    />
                </View>
            </>)}

            <View style={styles.commentItself}>
                <Text style={styles.theComment}>"{comment.rating.textArea.length > 0 ? (<Text>{comment.rating.textArea}</Text>) : (<Text>(No text comment added)</Text>)}"</Text>
                <View style={styles.thumbs}>
                    <View style={styles.thumbUpContainer}>
                        <TouchableOpacity onPress={() => onThumbUp(comment.id.toString())}>
                            {user && user.thumbsUp.includes(comment.id.toString()) ? (
                                <Image style={styles.thumbUp} source={require('../../../../assets/thumb-up.png')} />
                            )
                                :
                                (
                                    <Image style={styles.thumbUp} source={require('../../../../assets/thumb-up-unchecked.png')} />
                                )
                            }
                        </TouchableOpacity>

                        <Text>{comment.thumbsUp.length}</Text>
                    </View>

                    <View style={styles.thumbDownContainer}>
                        <TouchableOpacity onPress={() => onThumbDown(comment.id.toString())}>
                            {user && user.thumbsDown.includes(comment.id.toString()) ? (
                                <Image style={styles.thumbDown} source={require('../../../../assets/thumb-down.png')} />
                            )
                                :
                                (
                                    <Image style={styles.thumbDown} source={require('../../../../assets/thumb-down-unchecked.png')} />
                                )
                            }
                        </TouchableOpacity>

                        <Text>{comment.thumbsDown.length}</Text>
                    </View>

                    <TouchableOpacity style={styles.trashContainer} onPress={() => {
                        Alert.alert('Warning!', `You are about to delete your rating for '${toilet.place}'. Are you sure you want to proceed?`, [
                            { text: 'Cancel', onPress: () => { } },
                            {
                                text: 'I do!', onPress: () => onDelete(toilet.id.toString(), comment.id.toString())
                            }
                        ], { cancelable: false })
                    }}>
                        {user && comment.publisher._id.toString() === user.id.toString() && <Image style={styles.trash} source={require('../../../../assets/delete.png')} />}
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    </>)
}

export default PostComment