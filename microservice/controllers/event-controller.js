

const EventService = require('../services/event-service')


class EventController{
    constructor(config) {
     this.eventService = new EventService(config)
     this.login = this.login.bind(this)
     this.signup = this.signup.bind(this)
     this.getProfile = this.getProfile.bind(this)
     this.updateProfile = this.updateProfile.bind(this)
     this.uploadPhoto = this.uploadPhoto.bind(this)
     this.createEvent = this.createEvent.bind(this)
     this.fetchEvents = this.fetchEvents.bind(this)
     this.joinLeaveEvent = this.joinLeaveEvent.bind(this)
     this.fetchParticipants = this.fetchParticipants.bind(this)
    }


    async signup(req,res){
        try{
            console.log(req.body)
            let userData = req.body.data
            let parts = userData.dob.split('-')
            userData.dob = new Date(Number(parts[0]),Number(parts[1])-1,Number(parts[2]))
            let data = await this.eventService.signup(userData)
            if(data.message==="USER CREATED"){
                res.send({'response':'SUCCESS',data:"User created successfully",userId:data.userId})
            }else if(data.message==="ALREADY EXISTS"){
                res.send({'response':'FAILURE',data:"User already exists"})
            }
        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }

    async login(req,res){
        try{
            console.log(req.body)
         let userIdentity = req.body.data
         let data = await this.eventService.login(userIdentity)
         if(data){
         res.send({'response':'SUCCESS',data:{token:data}})
         }else{
             res.send({'response':'FAILURE',data:'user not authenticated'})
         }
        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }

    async getProfile(req,res){
        try{
            let userId=Number(req.params.userId)
            if(userId===req.decoded.userId){
                 let data = await this.eventService.getProfile(userId)
                 if(data){
                    res.send({'response':'SUCCESS',data:data})
                 }else{
                  res.send({'response':'FAILURE',data:"user not found"})
                     }
            }else{
                res.send({response: "FAILURE", message: "User not authorized"});
            }
        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }


    async updateProfile(req,res){
    try{
        if(req.body.data.userId===req.decoded.userId){
            let updatedData=req.body.data
            let data = await this.eventService.updateProfile(updatedData)
            if(data==="user updated"){
              res.send({'response':'SUCCESS',data:data})
                 }
        }else{
          res.send({response: "FAILURE", message: "User not authorized"});
         }
    }catch(err){
        let result = {'response':'ERROR','message':err.message}
        res.send(result)
    }
    }

    async uploadPhoto(req, res) {
         const path = req.body.path[0];
        try {
            res.send({result:`photo uploaded successfully to ${path}`});
        } catch(error){
            let json = {"response": "upload a png/jpeg/jpg  file"};
            res.send(json);
        }
    }

    async createEvent(req,res){
        try{
         if(req.body.data.userId===req.decoded.userId){
            console.log(req.body)
            let eventData = req.body.data
            eventData.participants=[]
            eventData.date = new Date(eventData.date)
            eventData.time = eventData.date.toTimeString()
            let data = await this.eventService.createEvent(eventData)
            if(data){
                res.send({'response':'SUCCESS',data:data})
            }
        }else{
            res.send({response: "FAILURE", message: "User not authorized"});
        }
        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }

    async fetchEvents(req,res){
        try{

                let data = await this.eventService.fetchEvents()
                if(data.length>0){
                    res.send({'response':'SUCCESS',data:data})
                }else{
                    res.send({'response':'FAILURE',data:"no events created"})
                }

        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }

    async joinLeaveEvent(req,res){
        try{
            let eventAction= req.body.data
            let data = await this.eventService.joinLeaveEvent(eventAction)
            if(data.length>0){
                res.send({'response':'SUCCESS',data:data})
            }else{
                res.send({'response':'FAILURE',data:"no events created"})
            }

        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }

    async fetchParticipants(req,res){
        try{
            let participants= req.body.data.participants
            let data = await this.eventService.fetchParticipants(participants)
            if(data.length>0){
                res.send({'response':'SUCCESS',data:data})
            }else{
                res.send({'response':'FAILURE',data:"no participants found"})
            }

        }catch(err){
            let result = {'response':'ERROR','message':err.message}
            res.send(result)
        }
    }


}

module.exports =EventController