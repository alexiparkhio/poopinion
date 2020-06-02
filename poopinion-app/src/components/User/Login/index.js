import React, { useState, useEffect } from 'react'
import { Feedback, Contact } from '../../'
import styles from './styles'
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator } from 'react-native'

function Login({ onSubmit, error, goToRegister, goToLanding, goToFAQs }) {
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (error) setLoading(false)
    }, [error])

    return (<>
        <KeyboardAvoidingView behavior='height'>
            <ScrollView>
                <View style={styles.container}>
                    <Image source={require('../../../../assets/header.png')} style={styles.image} />
                    <View style={styles.formContainer}>
                        <View>
                            <Text style={styles.header}>Login</Text>
                            <TextInput placeholderTextColor='grey' style={styles.form} placeholder='example@mail.com' onChangeText={(text) => setEmail(text.toLowerCase().trim())} />
                            <TextInput placeholderTextColor='grey' style={styles.form} placeholder='Password' secureTextEntry={true} onChangeText={(text) => setPassword(text)} />
                        </View>
                        {error && (<View style={{ flex: 0.20 }}>
                            <Feedback style={styles.feedback} level='warn' message={error} />
                        </View>)}
                        {!error && loading && (<>
                            <Text style={{ textAlign: 'center', fontStyle: 'italic' }}>Submit loading, please don't press anything...</Text>
                            <ActivityIndicator size="large" color="#0000ff" />
                        </>)}
                        <TouchableOpacity>
                            <Text style={styles.button} onPress={() => {
                                setLoading(true)
                                if (error) setLoading(false)
                                onSubmit(email, password)
                            }}>💩 Log in! 💩</Text>
                        </TouchableOpacity>
                        <View style={styles.navButtons}>
                            <TouchableOpacity style={styles.left}>
                                <Text style={styles.leftButton} onPress={goToRegister}>Sign Up</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.right}>
                                <Text style={styles.rightButton} onPress={() => {
                                    setLoading(true)
                                    goToLanding()
                                }} >Continue as Guest</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.version}>v.1.0.13</Text>
                    <View style={styles.bottomRow}>
                        <Contact />

                        <TouchableOpacity style={styles.bottomRight}>
                            <Text style={styles.bottomRightButton} onPress={goToFAQs}>Read me!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    </>)
}

export default Login