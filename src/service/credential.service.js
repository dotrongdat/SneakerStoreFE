import {routeCredentialAPI} from '../components/Constant/CredentialConstant';
import {encrypt} from '../components/Utils/Crypto.util';
import store from '../store/index';
import statusCode from 'http-status-codes';
import {nonAuthRequest} from '../components/Utils/Request.util';

const signin = async (model)=>{
    model.username=encrypt(model.username);
    model.password=encrypt(model.password);
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.signin,model);
    switch (res.status){
        case statusCode.OK: 
            const {user,token,refresh} = res.data.payload;
            store.dispatch({type:'signin',user,token,refresh});
            break;
        // case statusCode.UNAUTHORIZED:
        //     store.dispatch({type:'signout'});
        //     break;
        default:
    }
    return res;
}

const signout = () => {
    //const {user} = store.getState();
    store.dispatch({type: 'signout'});
}

const signup = async (model)=>{
    model.username=encrypt(model.username);
    model.password=encrypt(model.password);
    const res = await nonAuthRequest.postRequest(routeCredentialAPI.signup,model);                
    switch (res.status){
        case statusCode.OK: 
            const {user,token,refresh} = res.data.payload;
            store.dispatch({type:'signin',user,token,refresh});
            break;
        default:
    }
    return res;
}
const signinToken = async () =>{
    const lToken = localStorage.getItem('token');
    const lRefresh = localStorage.getItem('refresh');
        if(lToken && lRefresh){
            const res = await nonAuthRequest.postRequest(routeCredentialAPI.signinToken,{},{headers:{token:lToken, refresh:lRefresh}});    
            switch (res.status){
                case statusCode.OK:
                    const {user} =res.data.payload;
                    const token =res.data.payload.token || lToken;
                    store.dispatch({type:'signin',token,refresh:lRefresh,user});
                    break;
                case statusCode.UNAUTHORIZED:
                    store.dispatch({type:'signout'}); 
                    break;
                default:
            }
        }else store.dispatch({type:'signout'});        
}

const findByUsername = async (params) =>{
    return await nonAuthRequest.getRequest(routeCredentialAPI.findByUsername,params);
}
export default {
    signin,
    signout,
    signup,
    signinToken,
    findByUsername
}