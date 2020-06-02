import React, { useState, useEffect } from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native'
import moment from 'moment'
import { LocationMap } from '../../Geolocation'
import { PoopRating, PostComment, PostScore, FavButton } from '../'
import styles from './styles'

function ToiletDetails({ toilet, globalRating, user, onFav, onThumbUp, onThumbDown, onComment, onDelete, onDeleteToilet }) {
    return (<>
        <ScrollView >
            <View style={styles.container}>
                {toilet.image ? (<Image style={styles.image} source={{ uri: toilet.image }} />)
                    :
                    (<Image style={styles.image} source={require('../../../../assets/placeholder.jpg')} />)}
                <View style={styles.infoContainer}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.place}>{toilet.place}</Text>
                            <View style={styles.poopRating}>
                                <PoopRating toilet={toilet} />
                            </View>

                            <Text style={styles.postedAt}>Posted {moment(toilet.created).fromNow()}, by {toilet.publisher.name} {toilet.publisher.surname}</Text>
                        </View>
                        <TouchableOpacity style={styles.headerRight} onPress={() => { onFav(toilet.id) }}>
                            <FavButton user={user} toilet={toilet} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.scoreContainer}>
                        <PostScore toilet={toilet} onComment={onComment} globalRating={globalRating} />
                    </View>

                    <View style={styles.mapContainer}>
                        <Text style={styles.location}>Location:</Text>
                        <LocationMap target={toilet.geolocation} />
                    </View>

                    <View style={styles.commentsContainer}>
                        <Text style={styles.comments}>Last ratings/comments ({toilet.comments.length}):</Text>
                        {toilet.comments.length ?
                            (<FlatList
                                data={toilet.comments}
                                renderItem={({ item }) => {
                                    return <PostComment user={user} comment={item} onDelete={onDelete} onThumbUp={onThumbUp} onThumbDown={onThumbDown} toilet={toilet} />
                                }}
                            />)
                            :
                            (<Text>No comments to display...</Text>)}
                    </View>

                    {user && toilet.publisher.id.toString() === user.id.toString() && (<>
                        <TouchableOpacity onPress={() => {
                            Alert.alert('Warning!', `You are about to delete the toilet '${toilet.place}'. This will delete all info about the toilet as well as its ratings and comments. Are you sure you want to proceed?`, [
                                { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                                {
                                    text: 'I do!', onPress: () => onDeleteToilet(toilet.id.toString())
                                }
                            ], { cancelable: false })
                        }} style={styles.deleteContainer}>
                            <Text style={styles.deleteButton}>🗑️ Delete this toilet</Text>
                        </TouchableOpacity>
                    </>)}
                </View>
            </View>
        </ScrollView>
    </>)
}

export default ToiletDetails