import React from 'react'
import styles from './styles'
import { View, ScrollView, Text, FlatList } from 'react-native'
import { Post } from '../'

function QueryResults({ query, toilets, user, onFav, onDetails }) {
    return (<>
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>Results for: '{query}'</Text>
                {toilets.length > 0 &&

                    <View style={styles.resultsContainer}>
                        <FlatList
                            data={toilets}
                            renderItem={({ item }) => {
                                return <Post toilet={item} user={user} onFav={onFav} onDetails={onDetails} />
                            }}
                        />
                    </View>
                }

                {!toilets.length && <Text style={styles.noToilets}>No toilets to display...</Text>}
            </View>
        </ScrollView>
    </>)
}

export default QueryResults