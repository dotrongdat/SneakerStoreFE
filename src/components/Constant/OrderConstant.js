import {domain} from './APIConstant';

export const routeOrderAPI={
    main: domain+'/api/order',
    validation: domain+'/api/order/validation'
}
export const productOrderStatus={
    CANCEL : -1,
    PROCESSING : 0,
    APPROVED : 1,
    COMPLETE : 2
}
export const orderStatus={
    CANCEL : -1,
    PROCESSING : 0,
    APPROVED : 1,
    COMPLETE : 2
}
export const paymentMethodType = {
    COD : 1,
    PAYPAL : 2
}
