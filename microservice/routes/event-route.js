const express =require('express')
const configUtil = require('../../common/utils/config-util')
const EventController = require('../controllers/event-controller')
const VerifyToken = require('../../common/utils/verify-token')


const router= express.Router()
const eventController =new EventController(configUtil)
const verifyToken = new VerifyToken(configUtil)

const MulterFunc = require('../../common/utils/multerMiddleware');
const multerFunc=new MulterFunc();

router.post('/signup',eventController.signup)
router.post('/login',eventController.login)
router.get('/getProfile/:userId',verifyToken.verifyToken,eventController.getProfile)
router.post('/updateProfile',verifyToken.verifyToken,eventController.updateProfile)
router.post('/profilePhoto',multerFunc.altmulterStore,eventController.uploadPhoto);
router.post('/createEvent',verifyToken.verifyToken,eventController.createEvent)
router.get('/fetchEvents',verifyToken.verifyToken,eventController.fetchEvents)
router.post('/joinLeaveEvent',verifyToken.verifyToken,eventController.joinLeaveEvent)//join and leave event handler route
router.post('/fetchParticipants',verifyToken.verifyToken,eventController.fetchParticipants)//join and leave event handler route


module.exports= router