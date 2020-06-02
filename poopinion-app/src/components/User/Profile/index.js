import React, { useState, useEffect } from 'react'
import styles from './styles'
import { Text, ScrollView, TouchableOpacity, View, Image, ActivityIndicator, FlatList } from 'react-native'
import { LastPosts, LastComments } from '../'
import moment from 'moment'

function Profile({ user, onDetails, onToUpdateUser }) {
    const [view, setView] = useState('posts')

    return (<>
        <ScrollView style={styles.container}>
            <View style={styles.nameContainer}>
                <View style={styles.nameHeader}>
                    <TouchableOpacity style={styles.picture} onPress={() => onToUpdateUser(user.id.toString())}>
                        {user.publishedToilets.length < 5 && user.comments.length < 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_bronze.png')} />}
                        {user.publishedToilets.length < 5 && user.comments.length >= 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_bronze_pro.png')} />}

                        {user.publishedToilets.length >= 5 && user.publishedToilets.length < 10 && user.comments.length < 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_silver.png')} />}
                        {user.publishedToilets.length >= 5 && user.publishedToilets.length < 10 && user.comments.length >= 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_silver_pro.png')} />}

                        {user.publishedToilets.length >= 10 && user.comments.length < 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_gold.png')} />}
                        {user.publishedToilets.length >= 10 && user.comments.length >= 10 && <Image style={styles.profilePic} source={require('../../../../assets/profile_gold_pro.png')} />}
                    </TouchableOpacity>
                    <View style={styles.nameInfo}>
                        <Text style={[styles.font, styles.bold]}>Name: {user.name} {user.surname}</Text>
                        <Text style={styles.font}>Gender: {user.gender}</Text>
                        <Text style={styles.font}>Age: {moment().diff(user.age, 'years')} years</Text>
                        <Text style={styles.font}>email: {user.email}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.navContainer}>
                <View style={styles.separator} />

                <View style={styles.navButtons}>
                    <TouchableOpacity onPress={() => setView('posts')}>
                        <Text style={styles.navButtonText}>{user.publishedToilets.length} Toilet Post(s)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setView('comments')}>
                        <Text style={styles.navButtonText}>{user.comments.length} Comment(s)</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.separator} />
            </View>

            {view === 'posts' && (<>
                <View style={styles.posts}>
                    {user.publishedToilets.length > 0 && (<>
                        <FlatList
                            data={user.publishedToilets}
                            renderItem={({ item }) => {
                                return <LastPosts toilet={item} onDetails={onDetails} />
                            }}
                        />
                    </>)}
                    {!user.publishedToilets.length && (<>
                        <Text>No toilets to display...</Text>
                    </>)}
                </View>
            </>)}

            {view === 'comments' && (<>
                <View style={styles.comments}>
                    {user.comments.length > 0 && (<>
                        <FlatList
                            data={user.comments}
                            renderItem={({ item }) => {
                                return <LastComments comment={item} onDetails={onDetails} />
                            }}
                        />
                    </>)}
                    {!user.comments.length && (<>
                        <Text>No comments to display...</Text>
                    </>)}
                </View>
            </>)}

        </ScrollView>
    </>)
}

export default Profile