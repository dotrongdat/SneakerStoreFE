import {routeProductAPI} from '../components/Constant/ProductConstant';
import {CreateForm} from '../components/Utils/FormData.util';
import {nonAuthRequest,authRequest} from '../components/Utils/Request.util';

const search = async (params)=> await nonAuthRequest.getRequest(routeProductAPI.search,params);
const create = async (model)=> await authRequest.postRequest(routeProductAPI.main,CreateForm(model),
                                    {
                                        validateStatus:false,
                                        headers: {"Content-Type":'multipart/form-data'}
                                    });
const update = async (model)=> await authRequest.putRequest(routeProductAPI.main,CreateForm(model),{
                                        validateStatus:false,
                                        headers: {"Content-Type":'multipart/form-data'}
                                    });
const _delete = async (data)=> await authRequest.deleteRequest(routeProductAPI.main,data);
const get = async (_id)=> await nonAuthRequest.getRequest(routeProductAPI.main+'/'+_id);

export default {
    search,
    create,
    update,
    _delete,
    get
}