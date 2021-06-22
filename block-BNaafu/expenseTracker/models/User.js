var mongoose = require('mongoose');
var Schema = mongoose.Schema

var UserSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,minlength:4},
    age:{type:Number,default:0},
    phone:Number,
    Country:String,
    github: {
        name:String,
        username:String,
        image:String
    },

    google: {
        name:String,
        image:String
    },
    providers: [String]
},{timestamps:true});

UserSchema.pre('save',function(next){
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashed) => {
            if(err) return next (err)
            this.password = hashed;
            return next();
        })
    } else{
        next();
    }
})

userSchema.methods.verifyPassword = function(cb,password){
    bcrypt.compare(password,this.password,(err,result) => {
        return cb(err,result);
    })
}

var User = mongoose.model('User',UserSchema);
module.exports = User;





// Name
// Email
// Password
// Age
// Phone
// Country