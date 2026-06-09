const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uri = 'mongodb://localhost:27017/mydb';
const [,,email, newPass] = process.argv;
if(!email || !newPass){ console.error('Usage: node reset-password.js email newPassword'); process.exit(1); }
(async()=>{
  try{
    await mongoose.connect(uri);
    const UserSchema = new mongoose.Schema({}, { strict:false });
    const User = mongoose.model('User', UserSchema, 'users');
    const hash = await bcrypt.hash(newPass, 10);
    const res = await User.findOneAndUpdate({email}, {$set:{password:hash}}, {new:true});
    if(!res) { console.error('User not found'); process.exit(2); }
    console.log('Password updated for', email);
    await mongoose.disconnect();
    process.exit(0);
  }catch(err){ console.error(err); process.exit(3);} 
})();
