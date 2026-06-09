const m=require('mongoose');
(async ()=>{
  try{
    await m.connect('mongodb://localhost:27017/mydb');
    const S=new m.Schema({}, {strict:false});
    const U=m.model('User', S, 'users');
    const u=await U.findOne({email:'manyata@gmail.com'}).lean();
    if(!u) console.log('NOT FOUND');
    else console.log(JSON.stringify({email:u.email,username:u.username,_id:u._id,createdAt:u.createdAt,updatedAt:u.updatedAt}, null, 2));
    await m.disconnect();
  }catch(e){ console.error(e); process.exit(1); }
})();
