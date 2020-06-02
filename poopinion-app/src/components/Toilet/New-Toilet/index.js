import React from 'react'
import styles from './styles'
import { ActivityIndicator, View, ScrollView, TouchableOpacity, Text, Alert, TextInput, Image, Button, Slider, Picker, KeyboardAvoidingView } from 'react-native'
import MapView from 'react-native-maps'
import * as ImagePicker from 'expo-image-picker'

export default class NewToilet extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            place: undefined,
            wheelchair: false,
            cleanness: 0,
            looks: 0,
            paymentRequired: 0,
            paperDeployment: 0,
            multipleToilets: 0,
            overallRating: 0,
            textArea: '',
            loading: false,
            height: 40
        }
    }

    render() {
        let { image, wheelchair, place } = this.state

        return (<>
            <KeyboardAvoidingView behavior='height'>
                <ScrollView style={styles.container}>
                    <Text style={styles.header}>New Toilet Post</Text>

                    <View style={styles.locationContainer}>
                        <Text style={styles.locationHeader}>Location:</Text>
                        {this.props.coordinates.latitude && this.props.coordinates.longitude &&
                            <MapView style={styles.mapStyle}
                                region={{
                                    latitude: this.props.coordinates.latitude,
                                    longitude: this.props.coordinates.longitude,
                                    latitudeDelta: this.props.coordinates.latitudeDelta,
                                    longitudeDelta: this.props.coordinates.longitudeDelta,
                                }}>
                                <MapView.Marker coordinate={{
                                    latitude: this.props.coordinates.latitude,
                                    longitude: this.props.coordinates.longitude
                                }} />
                            </MapView>}
                    </View>

                    <View style={styles.uploadInfo}>
                        <View style={styles.place}>
                            <Text style={styles.placeName}>Place: </Text>
                            <TextInput style={styles.placeInput} placeholder='insert the place here' onChangeText={(text) => this.setState({ place: text.trim() })} />
                        </View>
                        <View style={styles.options}>
                            <Button title='Upload image' onPress={this._pickImage} />
                        </View>

                        {image && <Image source={{ uri: image }} style={{ width: '100%', height: 200, marginBottom: 20 }} />}

                        <View style={styles.disabledInfo}>
                            {wheelchair ? (<TouchableOpacity onPress={() => this.setState({ wheelchair: !wheelchair })}><Image style={styles.disabledLogo} source={require('../../../../assets/wheelchair.png')} /></TouchableOpacity>)
                                :
                                (<TouchableOpacity onPress={() => this.setState({ wheelchair: !wheelchair })}><Image style={styles.disabledLogoOpacity} source={require('../../../../assets/wheelchair.png')} /></TouchableOpacity>)}
                            <Text style={styles.disabledTextContent}>Disabled toilet availability</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>How clean did you find it?: <Text style={styles.value}>{this.state.cleanness}</Text></Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => this.setState({ cleanness: parseInt(value) })}
                            />
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>How good does it look?: <Text style={styles.value}>{this.state.looks}</Text></Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => this.setState({ looks: parseInt(value) })}
                            />
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>Do you have to pay in order to use the toilet?:</Text>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={this.state.paymentRequired}
                                onValueChange={(itemValue) =>
                                    this.setState({ paymentRequired: itemValue })
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
                                selectedValue={this.state.multipleToilets}
                                onValueChange={(itemValue) =>
                                    this.setState({ multipleToilets: itemValue })
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
                                selectedValue={this.state.paperDeployment}
                                onValueChange={(itemValue) =>
                                    this.setState({ paperDeployment: itemValue })
                                }>
                                <Picker.Item style={styles.form} label="Yes" value={1} />
                                <Picker.Item style={styles.form} label="No" value={0} />
                            </Picker>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={[styles.question, styles.value]}>OVERALL RATING: <Text style={styles.value}>{this.state.overallRating}</Text></Text>
                        <View style={styles.sliderContainer}>
                            <Text>0</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={5}
                                onValueChange={(value) => this.setState({ overallRating: parseInt(value) })}
                            />
                            <Text>5</Text>
                        </View>
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.question}>(Optional) Add a comment here:</Text>
                        <View style={styles.sliderContainer}>
                            <TextInput multiline={true} onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)} style={styles.input} placeholder='Start writing here' onChangeText={(text) => this.setState({ textArea: text })} />
                        </View>
                    </View>

                    {this.state.loading && (<>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Submit loading, please don't press anything...</Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </>)}

                    <TouchableOpacity >
                        <Text style={styles.submitButton} onPress={() => {
                            Alert.alert(undefined, `Are you sure you want to create a toilet post called '${typeof place === 'undefined' ? 'No place defined' : place}'?`, [
                                { text: 'Cancel', onPress: () => { } },
                                {
                                    text: 'I do!', onPress: () => {
                                        this._onSubmit()
                                    },
                                }
                            ], { cancelable: false })
                        }}>💩 Submit! 💩</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </>)
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    _onSubmit = () => {
        this.setState({ loading: true })
        this.props.onSubmit(this.state.place, this.state.image, this.state.wheelchair, {
            rating: {
                cleanness: this.state.cleanness,
                looks: this.state.looks,
                paymentRequired: this.state.paymentRequired,
                paperDeployment: this.state.paperDeployment,
                multipleToilets: this.state.multipleToilets,
                overallRating: this.state.overallRating,
                textArea: this.state.textArea
            }
        })
    };

    updateSize = (height) => {
        this.setState({
            height
        });
    }
}