import React, { useState } from 'react'
import styles from './styles'
import Post from '../Post'
import { Text, ScrollView, View, FlatList } from 'react-native'

function Favorites({ user, favToilets, onFav, onDetails }) {
    return (<>
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>{user.name} {user.surname}'s Favorite Toilets 🚽</Text>
            </View>

            <View style={styles.favsContainer}>
                {favToilets.length > 0 && (<>
                    <FlatList
                        data={favToilets}
                        renderItem={({ item }) => {
                            return <Post user={user} onFav={onFav} onDetails={onDetails} toilet={item} />
                        }}
                    />
                </>)}

                {!favToilets.length && <Text style={styles.noFavs}>No favorite toilets to display...</Text>}
            </View>
        </ScrollView>
    </>)
}

export default Favorites