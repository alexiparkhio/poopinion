import React, { useState } from 'react'
import moment from 'moment'
import { View, TouchableHighlight, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import styles from './styles'
import { PoopRating, FavButton } from '../'

function Post({ toilet, onDetails, onFav, user }) {
    const [loading, setLoading] = useState(undefined)

    return (<>
        <View style={styles.posts}>
            <View style={styles.post}>
                {toilet.image ? (<>
                    <TouchableHighlight activeOpacity={0.5} onPress={() => {
                        setLoading(toilet.id)
                        onDetails(toilet.id)
                    }}>
                        <Image style={styles.image} source={{ uri: toilet.image }} />
                    </TouchableHighlight>
                </>)
                    :
                    (<>
                        <TouchableHighlight activeOpacity={0.5} onPress={() => {
                            setLoading(toilet.id)
                            onDetails(toilet.id)
                        }}>
                            <Image style={styles.image} source={require('../../../../assets/placeholder.jpg')} />
                        </TouchableHighlight>
                    </>)}
                <View style={styles.postContent}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.place}>{toilet.place} {toilet.score ? (<Text>({toilet.score})</Text>) : ''}</Text>
                            {toilet.score && (<PoopRating toilet={toilet} />)}

                            <Text style={styles.postedAt}>Posted {moment(toilet.created).fromNow()}, by {toilet.publisher.name} {toilet.publisher.surname}</Text>
                        </View>
                        <TouchableOpacity style={styles.headerRight} onPress={() => { onFav(toilet.id) }}>
                            <FavButton user={user} toilet={toilet} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
        {loading === toilet.id && (<>
            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Loading post, please don't press anything...</Text>
            <ActivityIndicator size="large" color="#0000ff" />
        </>)}
    </>)
}

export default Post