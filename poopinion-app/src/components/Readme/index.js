import React, { useState } from 'react'
import styles from './styles'
import { View, ScrollView, TouchableOpacity, Text, Image } from 'react-native'

function Readme({ goBack }) {
    const [page, setPage] = useState(1)

    function pageUp() {
        if (page === 3) setPage(1)
        else setPage(page + 1)
    }

    function pageDown() {
        if (page === 1) setPage(3)
        else setPage(page - 1)
    }

    return (<>
        <View style={styles.container}>
            <Image style={styles.imageHeader} source={require('../../../assets/header.png')} />

            <ScrollView style={styles.mainContainer}>
                {page === 1 && (<>
                    <View>
                        <Text style={styles.textHeader}>Introduction</Text>
                        <Text style={styles.textContent}>{`Thank you for downloading Poopinion! As a new junior web-app developer in this world it humbles me that you decided to start using this small app.`}</Text>
                        <Text style={styles.textHeader}>What is Poopinion?</Text>
                        <Text style={styles.textContent}>{`Poopinion is a mobile-oriented app purposed on rating toilets on public spaces, such as restaurants, events or companies. It pursues to increase the standards of maintenance of those places and keep then clean, hygienic and pretty. Toilet necessities are evident and society needs better ways to know the quality of toilets they might be end up using.\n\nThe application is inspired by other rating apps such as TripAdvisor, where you can evaluate several features and give an overall score. The main difference is that Poopinator will allow registered users to post themselves, rather than check for company posts and rate them. This decision is done so the rating of toilets if full community-oriented.`}</Text>
                    </View>
                </>)}

                {page === 2 && (<>
                    <View>
                        <Text style={styles.textHeader}>How does it work?</Text>
                        <Text style={styles.textContent}>{`Using Poopinion is very simple and especially if you have used rating-based sites in the past. You can either use is as a friendly guest who just checks for a nice and clean toilet to use, or register and make your own posts!`}</Text>
                        <Text style={styles.textHeader}>Steps to publish:</Text>
                        <Text style={styles.textContent}>{`\t\t1) Register to the service!\n\n\t\t2) Be in the spot where the toilet is placed\n\n\t\t3) You can take a picture of the toilet and upload it (please just take a picture of the room, do not show anything inappropiate!!)\n\n\t\t4) That's it! The post is made and you can go and rate it, and so does every other user!`}</Text>
                    </View>
                </>)}

                {page === 3 && (<>
                    <View>
                        <Text style={styles.textHeader}>Additional Info:</Text>
                        <Text style={styles.textContent}>{`Please keep in mind that I am a very rookie developer but I am doing my best to keep this app as polished as possible, and I'll work hard to make it better in the future!\n\nAs said before, the purpose of this app is to make places cleaner on standards so I beg you all to avoid using this app in a wrong manner: no racist, sexist, and other offensive messages and images.\n\nFeatures I am planning to add in the future:\n\n\t\t-Multiple image uploading\n\t\t-Faster loadings and refreshments\n\t\t-Better user interface\n\t\t-Better map-based services\n\nIf you have any feedback or suggestions, please feel free to contact me through the contact buttons in the Login screen. Thank you very much!\n\nÀlex Park Viñas`}</Text>
                    </View>
                </>)}
            </ScrollView>

            <View style={styles.navContainer}>
                <View style={styles.pageNav}>
                    <TouchableOpacity style={styles.navButton} onPress={() => pageDown()}>
                        <Image style={styles.navButtonImage} source={require('../../../assets/previous.png')} />
                    </TouchableOpacity>

                    <Text style={styles.pageNumber}>{page} / 3</Text>

                    <TouchableOpacity style={styles.navButton} onPress={() => pageUp()}>
                        <Image style={styles.navButtonImage} source={require('../../../assets/next.png')} />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
                    <Text style={styles.button}>Go back</Text>
                </TouchableOpacity>
            </View>
        </View>
    </>)
}

export default Readme