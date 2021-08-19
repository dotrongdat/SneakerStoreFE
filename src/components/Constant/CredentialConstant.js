import {domain} from './APIConstant';

export const routeCredentialAPI={
    signin: domain+'/api/credential/signin',
    signout: domain+'/api/credential/signout',
    signup: domain+'/api/credential/signup',
    signinToken: domain+'/api/credential/signinToken' 
}
export const roles={
    NO_AUTH: 0,
    CUSTOMER: 1,
    ADMIN: 2
}