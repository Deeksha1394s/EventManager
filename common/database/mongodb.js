const mongoClient = require('mongodb').MongoClient;

class MongoDB{

    constructor(url) {
       this.url = url
    }

    findRecord(collection,query,fields){

        return new Promise((resolve,reject)=>{

         mongoClient.connect(this.url,function(err,db){
               if(err){
                   reject(error);
               } else{
                db.collection(collection).find(query,fields?fields:{}).toArray(function(err,res){
                     if(err){
                        reject(err)
                     }else{
                         resolve(res)
                     }
                })
               }
         })
        })
    }

    fetchSequenceValue(sequenceName) {

        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection("counters").findOneAndUpdate({_id: sequenceName}, {$inc: {sequence: 1}}, {returnOriginal: false}, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            console.log(res.value.sequence);
                            db.close();
                            resolve(res.value.sequence);
                        }
                    });
                }
            });
        });
    };

    createRecord(collection, document) {

        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).insertOne(document, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };

    updateRecord(collection, query, values) {
        return new Promise((resolve, reject) => {
            mongoClient.connect(this.url, function (error, db) {
                if (error) {
                    reject(error);
                } else {
                    db.collection(collection).updateOne(query, values, function (err, res) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close();
                            resolve(res);
                        }
                    });
                }
            });
        });
    };


}

module.exports = MongoDB