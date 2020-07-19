const MongoDB = require('../../common/database/mongodb')
const bcrypt  = require('bcrypt')
const jwt    = require('jsonwebtoken');

class EventService{

  constructor(config) {
      this.config =config
      this.mongoDB = new MongoDB(config.get('mongodb:url'))
      this.login = this.login.bind(this)
      this.signup = this.signup.bind(this)
      this.getProfile = this.getProfile.bind(this)
      this.updateProfile = this.updateProfile.bind(this)
      this.createEvent = this.createEvent.bind(this)
      this.fetchEvents = this.fetchEvents.bind(this)
      this.joinLeaveEvent = this.joinLeaveEvent.bind(this)

   }

   async signup(userData){
       let query = {emailId:userData.emailId}
       let fetchUserIdentity =await this.mongoDB.findRecord('users',query)
       let result
       if(fetchUserIdentity.length===0){
           userData.password = await new Promise(
               (resolve, reject) => {
                   bcrypt.hash(userData.password, 10, function(err, hash) {
                       if(err){
                           reject(err);
                       }else{
                           resolve(hash);
                       }
                   });
               });

           userData.userId = await this.mongoDB.fetchSequenceValue("userId")
        let createUser = await this.mongoDB.createRecord('users',userData)
           result ={message:"USER CREATED",userId:userData.userId}
       }else{
           result ={message:"ALREADY EXISTS"}}
       return result
   }

   async login(userIdentity){
       let query = {emailId:userIdentity.emailId}
       let fields ={_id:0}
       let fetchUserIdentity =await this.mongoDB.findRecord('users',query,fields)
       console.log(fetchUserIdentity[0])
       let passwordMatched = false
       let localToken
       passwordMatched = await new Promise(
           (resolve, reject) => {
               bcrypt.compare(userIdentity.password, fetchUserIdentity[0].password, function (err, res) {
                   if (err) {
                       reject(err);
                   }
                   else {
                       resolve(res);
                   }
               });
           });
       if(passwordMatched){
         localToken = await new Promise((res,rej)=>{
             res(jwt.sign(fetchUserIdentity[0],this.config.get('token:secret'), {expiresIn: this.config.get('token:expires')}))
       });}
      return localToken
   }

    async getProfile(userId){
        let query = {userId:userId}
        let fields ={_id:0,password:0}
        let fetchUserIdentity =await this.mongoDB.findRecord('users',query,fields)
        if(fetchUserIdentity.length===0)
        return
        return fetchUserIdentity[0]
    }

    async updateProfile(userData){
        let query = {"userId": userData.userId};
        let values = {$set:{
                firstName: userData.firstName,
                lastName: userData.lastName,
                dob: userData.dob,
                gender: userData.gender,
            }}
        let updateUserData =await this.mongoDB.updateRecord('users',query,values)
        let result = "user updated"
        return result
    }

    async createEvent(eventData){
        eventData.eventId = await this.mongoDB.fetchSequenceValue("eventId")
        let createEventData =await this.mongoDB.createRecord('events',eventData)
        let result = "event created"
        return result
    }

    async fetchEvents(){
        let query = {}
        let fields = {_id:0}
        let fetchEvents =await this.mongoDB.findRecord('events',query,fields)
        return fetchEvents
    }

    async joinLeaveEvent(eventAction){
        let result
        let query = {'eventId' : eventAction.eventId}
        let values

       if(eventAction.action === "join" && eventAction.participants.length+1<=eventAction.maxParticipants ){
           values = {$addToSet:{participants:eventAction.userId}}
           result = "user added to event"
       }else if(eventAction.action === "leave" ){
            values = {$pull:{participants:eventAction.userId}}
           result="user removed from event"
       }

       if(eventAction.action ==="join"||eventAction.action==="leave")
       {let updateEvent = await this.mongoDB.updateRecord('events',query,values)
        console.log(updateEvent)
        return result}
       return "invalid action"
    }

    async fetchParticipants(participants){
        let query = {userId:{$in :participants}}
        let fields = {_id:0,password:0,dob:0,gender:0,emailId:0}
        let fetchParticipants = await this.mongoDB.findRecord('users',query,fields)
        return fetchParticipants
    }


}

module.exports =EventService