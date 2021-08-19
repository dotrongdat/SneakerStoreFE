import {createStore} from 'redux';
import {roles} from '../components/Constant/CredentialConstant';

const DEFAULT_STATE={
    isSignIn: false,
    user: {
        role:roles.NO_AUTH,
        cart:[]
    },
    categories:[]
}
const reducer = (state=DEFAULT_STATE, action) =>{

    switch (action.type){
        // eslint-disable-next-line no-lone-blocks
        // case 'syncSignIn':{
        //     const {user} = action.user;
        //     global.socket.emit('SignIn',user);            
        //     return {...state,isSignIn:true,user};
        // }
        // case 'syncSignOut':{
        //     const {user} = action.user;
        //     global.socket.emit('SignOut',user);            
        //     return {...state,isSignIn:true,user};
        // }
        case 'sync':{
            console.log(action.user);
            return {...state,user:action.user};
        }
        case 'signin': {
            const user = action.user || state.user;

            action.token && localStorage.setItem('token',action.token);
            action.refresh && localStorage.setItem('refresh',action.refresh);
            localStorage.setItem('user',JSON.stringify(user));

            (!state.user || state.user._id !== user._id) && global.socket.emit('signIn',user);
            return {...state,
            isSignIn : true,
            user
        }};
        case 'signout': {
            localStorage.removeItem('token');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            global.socket.emit('signOut',state.user, JSON.parse(localStorage.getItem('socketID')));
            return {...DEFAULT_STATE,categories:state.categories};
        }
        case 'initializeCategories':{
            return {...state,categories:action.categories};
        }
        case 'addCategory':{
            return {...state,categories:[...state.categories,action.category]}
        }
        case 'updateCart': {
            return {...state,user : {...state.user,cart: action.cart}};
        }
        default: return state;
    }
}
const store = createStore(reducer);
export default store;
