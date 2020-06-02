import React, { useState } from 'react'
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native'
import styles from './styles'
import moment from 'moment'

function LastPosts({toilet, onDetails}) {
    const [toiletLoading, setToiletLoading] = useState(undefined)

    return (<>
        <TouchableOpacity onPress={() => {
            setToiletLoading(toilet.id)
            onDetails(toilet.id.toString())
        }} style={styles.postsContainer}>
            <View style={styles.innerPost}>
                <View style={styles.postsLeft}>
                    <Text style={styles.postTitle}>{toilet.place}</Text>
                    <Text style={styles.postDate}>Total favorites: {toilet.isFavedBy.length}</Text>
                    <Text style={styles.postDate}>Posted {moment(toilet.created).fromNow()}</Text>
                </View>
                <View style={styles.postsRight}>
                    {toilet.image ? (<Image style={styles.image} source={{ uri: toilet.image }} />)
                        :
                        (<Image style={styles.image} source={require('../../../../assets/placeholder.jpg')} />)}
                </View>
            </View>
        </TouchableOpacity>
        {toiletLoading === toilet.id && (<>
            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Submit loading, please don't press anything...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </>)}

    </>)
}

export default LastPosts