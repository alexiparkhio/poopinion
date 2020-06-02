const { Router } = require('express')
const {
    registerUser,
    authenticateUser,
    retrieveUser,
    updateUser,
    saveToiletPhoto,
    retrieveToiletPhoto,
    publishToilet,
    updateToilet,
    deleteToilet,
    searchToilets,
    retrieveToilet,
    toggleFavToilet,
    retrieveFavToilets,
    publishComment,
    updateComment,
    deleteComment,
    toggleThumbUp,
    toggleThumbDown,
    retrieveTopToilets,
    deleteToiletPhoto
} = require('./handlers')
const bodyParser = require('body-parser')
const { jwtVerifierMidWare } = require('../mid-wares')
const jsonBodyParser = bodyParser.json()

const router = new Router()

router.post('/users', jsonBodyParser, registerUser)

router.post('/users/auth', jsonBodyParser, authenticateUser)

router.get('/users', jwtVerifierMidWare, retrieveUser)

router.patch('/users', [jwtVerifierMidWare, jsonBodyParser], updateUser)

router.post('/upload/:toiletId', jwtVerifierMidWare, saveToiletPhoto)

router.get('/load/:toiletId', retrieveToiletPhoto)

router.post('/users/toilet', [jwtVerifierMidWare, jsonBodyParser], publishToilet)

router.patch('/users/toilet/:toiletId', [jwtVerifierMidWare, jsonBodyParser], updateToilet)

router.delete('/users/toilet/:toiletId/delete', jwtVerifierMidWare, deleteToilet)

router.delete('/toilet/:toiletId/delete-image', deleteToiletPhoto)

router.get('/toilets', searchToilets)

router.get('/top-toilets', retrieveTopToilets)

router.get('/toilets/:toiletId', retrieveToilet)

router.patch('/users/toilet/:toiletId/favorite', jwtVerifierMidWare, toggleFavToilet)

router.get('/users/favorites', jwtVerifierMidWare, retrieveFavToilets)

router.post('/users/toilet/:toiletId/comment', [jwtVerifierMidWare, jsonBodyParser], publishComment)

router.patch('/users/comment/:commentId', [jwtVerifierMidWare, jsonBodyParser], updateComment)

router.delete('/users/toilet/:toiletId/comment/:commentId/delete', jwtVerifierMidWare, deleteComment)

router.patch('/users/comment/:commentId/thumb-up', jwtVerifierMidWare, toggleThumbUp)

router.patch('/users/comment/:commentId/thumb-down', jwtVerifierMidWare, toggleThumbDown)

module.exports = router