import {routeUserAPI} from '../components/Constant/UserConstant';
import {nonAuthRequest,authRequest} from '../components/Utils/Request.util';


const addToCart = async (model)=> await authRequest.putRequest(routeUserAPI.cartAddition,model); 
const updateCart = async (model) =>await authRequest.putRequest(routeUserAPI.cart,model);
const findByUsername = async (params) => await nonAuthRequest.getRequest(routeUserAPI.findByUsername,params);
const getCart = async () => await authRequest.getRequest(routeUserAPI.cart);

export default {
    addToCart,
    updateCart,
    findByUsername,
    getCart
}