import React from 'react'
import { Image } from 'react-native'
import styles from './styles'

function FavButton({ user, toilet }) {
    return (<>
        {user && toilet.isFavedBy.includes(user.id) ?
            (<Image style={styles.favButton} source={require('../../../../assets/faved.png')} />)
            :
            (<Image style={styles.favButton} source={require('../../../../assets/fav.png')} />)
        }
    </>)
}

export default FavButton