import {routeOrderAPI} from '../components/Constant/OrderConstant';
import {authRequest} from '../components/Utils/Request.util';

const checkout = async (model)=> await authRequest.postRequest(routeOrderAPI.main,model);
const validate = async (model) => await authRequest.postRequest(routeOrderAPI.validation,model);
const get = async (params={}) => await authRequest.getRequest(routeOrderAPI.main,params);
const approve = async (model) => await authRequest.putRequest(routeOrderAPI.main,model);

export default {
    checkout,
    validate,
    approve,
    get
}