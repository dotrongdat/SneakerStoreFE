import userService from '../../service/user.service';
import Validation from '../Cores/Validation';

const checkExistUsername = async (username)=>{
    const res = await userService.findByUsername({username});
    return res.data.payload.user == null;
}
const signIn=data=>{
    const {username,password} = data;
    return [
        Validation({username})
        .notEmpty('Username is empty',{ignore_whitespace:true}),
        Validation({password})
        .notEmpty('Password is empty',{ignore_whitespace:true})
    ]
}

const signUp= data=>{
    const {name,username,password,confirmPassword} = data;
    return [
        Validation({name})
        .notEmpty('Name is empty',{ignore_whitespace:true}),
        Validation({username})
        .notEmpty('Username is empty',{ignore_whitespace:true})
        // .bail()
        // .customAsync((checkExistUsername),'Username is exist')
        ,
        Validation({password})
        .notEmpty('Password is empty',{ignore_whitespace:true}),
        Validation({confirmPassword})
        .notEmpty('Confirm is empty',{ignore_whitespace:true})
        .bail()
        .custom((confirm)=>confirm === password,'Confirm is not equal')
    ]
}

export default {
    signIn,
    signUp
}