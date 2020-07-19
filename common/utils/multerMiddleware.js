const multer = require('multer');
const fs = require('fs-extra');

class MulterFunc {
    constructor() {
        this.altmulterStore=this.altmulterStore.bind(this);
    }

    altmulterStore(req,res,next){

        const storage = multer.diskStorage(
            {

                destination:function(req,file,cb){
                    let userId=JSON.parse(req.body.userId);
                    let dir =  `D:\\users\\profilePhoto\\${userId}`;
                    req.body['path']=[]
                    req.body['path'].push(dir)
                    fs.emptyDirSync(dir)//Ensures that a directory is empty. Deletes directory contents if the directory is not empty. If the directory does not exist, it is created. The directory itself is not deleted.
                    cb(null, dir) },

                filename: function (req, file, callback) {
                    callback(null, file.originalname);},

            }
        );

        let multerFunction=multer({
            storage: storage,
            fileFilter: function (req, file, callback) {
                if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg') {
                    return  callback(null, false);
                } else {
                    callback(null, true);
                }
            }
        }).array('profilePhoto',1);


         multerFunction(req,res,function callback(err){
             if(err){res.send({"response": err.code});
             }else{next();}
        })
    }
}


module.exports=MulterFunc;