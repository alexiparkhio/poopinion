import React, { useState, useEffect } from 'react'
import { Feedback } from '../../index'
import styles from './styles'
import { TextInputMask } from 'react-native-masked-text'
import { View, Text, TextInput, TouchableOpacity, Picker, Alert, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native'

function UpdateUser({ onSubmit, error, goToLanding, user }) {
    const [name, setName] = useState(user.name)
    const [surname, setSurame] = useState(user.surname)
    const [age, setAge] = useState(user.age)
    const [gender, setGender] = useState(user.gender)
    const [newPassword, setNewPassword] = useState('')
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setName(user.name)
        setSurame(user.surname)
        setAge(user.age)
        setGender(user.gender)
    }, [])

    return (<>
        <KeyboardAvoidingView behavior='height'>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.formContainer}>
                        <Text>Hi {user.name}! You can update your profile here. Feel free to change your info but please stay away from putting anything offensive. Thank you! 💩</Text>
                        <Text style={styles.header}>Update</Text>
                        <TextInput placeholderTextColor='grey' value={name} style={styles.form} placeholder={`Name (current: ${user.name})`} onChangeText={(text) => setName(text)} />
                        <TextInput placeholderTextColor='grey' value={surname} style={styles.form} placeholder={`Surname (current: ${user.surname})`} onChangeText={(text) => setSurame(text)} />

                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'YYYY-MM-DD'
                            }}
                            placeholderTextColor='grey'
                            keyboardType={'numeric'}
                            style={styles.form}
                            value={age}
                            placeholder={`D. of birth (current: ${user.age})`}
                            onChangeText={(ref) => setAge(ref)} />

                        <View style={styles.form}>
                            <Picker
                                value={gender}
                                selectedValue={gender}
                                onValueChange={(itemValue) =>
                                    setGender(itemValue)
                                }>
                                <Picker.Item style={styles.form} label="Male" value="male" />
                                <Picker.Item style={styles.form} label="Female" value="female" />
                                <Picker.Item style={styles.form} label="Non-binary" value="non-binary" />
                            </Picker>

                        </View>
                        <TextInput placeholderTextColor='grey' style={styles.form} placeholder='New password (optional)' secureTextEntry={true} onChangeText={(text) => setNewPassword(text)} />
                        <TextInput placeholderTextColor='grey' style={styles.form} placeholder='Password' secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
                    </View>
                    {error && <Feedback level='warn' message={error} />}
                    {!error && loading && (<>
                        <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Submit loading, please don't press anything...</Text>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </>)}
                    <Text style={styles.button} onPress={() => {
                        Alert.alert(undefined, 'Are you sure you want to update this info?', [
                            { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                            {
                                text: 'I do!', onPress: () => {
                                    setLoading(true)
                                    if (error) setLoading(false)
                                    onSubmit({ name, surname, age, newPassword, password, gender })
                                }
                            }
                        ], { cancelable: false })

                    }}>💩 Submit! 💩</Text>

                    <TouchableOpacity style={styles.right}>
                        <Text style={styles.rightButton} onPress={goToLanding} >Go back</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </>)
}

export default UpdateUser