import {routeCategoryAPI} from '../components/Constant/CategoryConstant';
import statusCode from 'http-status-codes';
import store from '../store/index';
import {authRequest, nonAuthRequest} from '../components/Utils/Request.util';

const getAll = async () =>{
    const res = await nonAuthRequest.getRequest(routeCategoryAPI.main);
    switch (res.status){
        case statusCode.OK:
            const {categories} = res.data.payload;
            store.dispatch({type:'initializeCategories',categories});
            break;
        default:
    }
    return res;
}
const create = async (model) => {
    const res = await authRequest.postRequest(routeCategoryAPI.main,model);
    switch (res.status){
        case statusCode.OK:
            const {category} = res.data.payload;
            store.dispatch({type:'addCategory',category});
            break;
        default:
            break;
    }
    return res;
}

export default {
    getAll,
    create
}