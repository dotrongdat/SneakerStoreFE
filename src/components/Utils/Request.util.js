import axios from 'axios';
import statusCode from 'http-status-codes';
import store from '../../store/index';

// const getRequest = (url,params,config)=>{
     
// }
// const postRequest = (url,model,config)=>{

// }
// const putRequest = (url,model,config)=>{

// }
// const deleteRequest = (url,model,)
const DEFAULT_CONFIG = {
    validateStatus:false
}
const handleAuthResponse = (res)=>{
    switch (res.status) {
        case statusCode.OK:
            const {token} = res.data.payload;
            if(token) store.dispatch({type:'signin',token});
            break;
        case statusCode.UNAUTHORIZED:
            store.dispatch({type:'signout'});
            break;
        default:
            break;
    }
}
const authRequest = {
    getRequest: async (url,params,config = DEFAULT_CONFIG)=>{
        const token = localStorage.getItem('token');
        const refresh = localStorage.getItem('refresh');
        const res = await axios.get(url,{
            ...config,
            params,
            headers:{...config.headers, token,refresh}
        });
        handleAuthResponse(res);
        return res;
    },
    postRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const token = localStorage.getItem('token');
        const refresh = localStorage.getItem('refresh');
        const res = await axios.post(url,model,{
            ...config,
            headers:{...config.headers, token,refresh}
        });
        handleAuthResponse(res);
        return res;
    },
    putRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const token = localStorage.getItem('token');
        const refresh = localStorage.getItem('refresh');
        const res = await axios.put(url,model,{
            ...config,
            headers:{...config.headers, token,refresh}
        });
        handleAuthResponse(res);
        return res;
    },
    deleteRequest: async (url,data,config = DEFAULT_CONFIG)=>{
        const token = localStorage.getItem('token');
        const refresh = localStorage.getItem('refresh');
        const res = await axios.delete(url,{
            ...config,
            data,
            headers:{...config.headers, token,refresh}
        });
        handleAuthResponse(res);
        return res;
    }
}

const handleNonAuthResponse = (res)=>{

}
const nonAuthRequest = {
    getRequest: async (url,params,config = DEFAULT_CONFIG)=>{
        const res = await axios.get(url,{
            ...config,
            params
        });
        handleNonAuthResponse(res);
        return res;
    },
    postRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const res = await axios.post(url,model,{
            ...config
        });
        handleNonAuthResponse(res);
        return res;
    },
    putRequest: async (url,model,config = DEFAULT_CONFIG)=>{
        const res = await axios.put(url,model,{
            ...config
        });
        handleNonAuthResponse(res);
        return res;
    },
    deleteRequest: async (url,data,config = DEFAULT_CONFIG)=>{
        const res = await axios.delete(url,{
            ...config,
            data
        });
        handleNonAuthResponse(res);
        return res;
    }
}

export {
    authRequest,
    nonAuthRequest
}