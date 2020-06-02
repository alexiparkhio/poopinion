import React, { useState } from 'react'
import { View, ScrollView, Text, TextInput, TouchableOpacity, Image, Alert, Picker, Slider, KeyboardAvoidingView, ActivityIndicator } from 'react-native'
import styles from './styles'

function NewComment({ toilet, onSubmit, user, onUpdate }) {
    const [cleanness, setCleanness] = useState(0)
    const [looks, setLooks] = useState(0)
    const [paymentRequired, setPaymentRequired] = useState(0)
    const [multipleToilets, setMultipleToilets] = useState(0)
    const [paperDeployment, setPaperDeployment] = useState(0)
    const [overallRating, setOverallRating] = useState(0)
    const [textArea, setTextArea] = useState('')
    const [loading, setLoading] = useState(false)
    const [height, setHeight] = useState(40)

    function updateSize(height) {
        setHeight(height)
    }

    return (<>
        <KeyboardAvoidingView behavior='height'>
            <ScrollView>
                {toilet.image ? (<Image style={styles.image} source={{ uri: toilet.image }} />)
                    :
                    (<Image style={styles.image} source={require('../../../../assets/placeholder.jpg')} />)}
                <View style={styles.container}>
                    <Text style={styles.header}>New rating/comment for: <Text style={styles.italic}>{toilet.place}</Text></Text>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>How clean did you find it?: <Text style={styles.value}>{cleanness}</Text></Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => setCleanness(parseInt(value))}
                            />
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>How good does it look?: <Text style={styles.value}>{looks}</Text></Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => setLooks(parseInt(value))}
                            />
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>Do you have to pay in order to use the toilet?:</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={paymentRequired}
                                onValueChange={(itemValue) =>
                                    setPaymentRequired(itemValue)
                                }>
                                <Picker.Item style={styles.form} label="Yes" value={1} />
                                <Picker.Item style={styles.form} label="No" value={0} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>Does it have multiple toilets?:</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={multipleToilets}
                                onValueChange={(itemValue) =>
                                    setMultipleToilets(itemValue)
                                }>
                                <Picker.Item style={styles.form} label="Yes" value={1} />
                                <Picker.Item style={styles.form} label="No" value={0} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>Is the toilet paper provision good?:</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={paperDeployment}
                                onValueChange={(itemValue) =>
                                    setPaperDeployment(itemValue)
                                }>
                                <Picker.Item style={styles.form} label="Yes" value={1} />
                                <Picker.Item style={styles.form} label="No" value={0} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={[styles.question, styles.value]}>OVERALL RATING: <Text style={styles.value}>{overallRating}</Text></Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => setOverallRating(parseInt(value))}
                            />
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>(Optional) Add a comment here:</Text>
                        <View style={styles.sliderContainer}>
                            <TextInput multiline={true} onContentSizeChange={(e) => updateSize(e.nativeEvent.contentSize.height)} style={styles.input} placeholder='Start writing here' onChangeText={(text) => setTextArea(text)} />
                        </View>
                    </View>
                </View>

                {loading && (<>
                    <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Submit loading, please don't press anything...</Text>
                    <ActivityIndicator size="large" color="#0000ff" />
                </>)}

                <View>
                    {user.comments.length && typeof user.comments.find(comment => comment.commentedAt.toString() === toilet.id.toString()) !== 'undefined' ? (<>
                        <TouchableOpacity onPress={() => {
                            Alert.alert(undefined, `Are you sure you want to update your rating for ${toilet.place}?`, [
                                { text: 'Cancel', onPress: () => { } },
                                {
                                    text: 'I do!', onPress: () => {
                                        setLoading(true)
                                        onUpdate({
                                            rating: {
                                                cleanness,
                                                looks,
                                                paymentRequired,
                                                multipleToilets,
                                                paperDeployment,
                                                overallRating,
                                                textArea
                                            }
                                        }, { commentId: user.comments.find(comment => comment.commentedAt.toString() === toilet.id.toString()).id.toString() })
                                    }
                                }
                            ], { cancelable: false })
                        }}>
                            <Text style={styles.submit}>💩 SUBMIT 💩</Text>
                        </TouchableOpacity>
                    </>)
                        :
                        (<>
                            <TouchableOpacity onPress={() => {
                                Alert.alert(undefined, `Are you sure you want to publish this rating on ${toilet.place}?`, [
                                    { text: 'Cancel', onPress: () => { } },
                                    {
                                        text: 'I do!', onPress: () => {
                                            onSubmit({
                                                rating: {
                                                    cleanness,
                                                    looks,
                                                    paymentRequired,
                                                    multipleToilets,
                                                    paperDeployment,
                                                    overallRating,
                                                    textArea
                                                }
                                            })
                                        }
                                    }
                                ], { cancelable: false })
                            }}>
                                <Text style={styles.submit}>💩 SUBMIT 💩</Text>
                            </TouchableOpacity>
                        </>)}
                </View>
            </ScrollView>

        </KeyboardAvoidingView>
    </>)
}

export default NewComment