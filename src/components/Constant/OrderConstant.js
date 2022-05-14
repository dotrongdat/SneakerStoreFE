import {domain} from './APIConstant';

export const routeOrderAPI={
    main: domain+'/api/order',
    validation: domain+'/api/order/validation',
    checkoutVNPay: domain+'/api/order/vnpay'
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
    PAYPAL : 2,
    VNPAY: 3
}
export const SHIPPING_LOGO = 'https://storage.googleapis.com/maskstore-abf18.appspot.com/1651595171016.png';
export const CASH_ON_DELIVERY_LOGO = 'https://storage.googleapis.com/maskstore-abf18.appspot.com/1651595295387.png';
export const AHAMOVE_LOGO = 'https://storage.googleapis.com/maskstore-abf18.appspot.com/1651596871745.png';
export const GHN_LOGO = 'https://storage.googleapis.com/maskstore-abf18.appspot.com/1651597359517.png';
export const VNPAY_LOGO = 'https://storage.googleapis.com/maskstore-abf18.appspot.com/1651597786769.png';
export const PAYPAL_LOGO = 'https://storage.googleapis.com/maskstore-abf18.appspot.com/1652082131593.png';
export const vnp_TmnCode = 'FCVWPDR0';
export const vnp_HashSecret = 'UCLOAJMWLJDPSFQLDJWTLFFGXXISMTPI';
export const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
export const vnp_Url_config = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_ReturnUrl: 'http://localhost:3000/checkoutResult',
    vnp_HashSecret,
    vnp_CurrCode: 'VND',
    vnp_Locale: 'vn',
    vnp_OrderInfo: 'Thanh toan don hang',
    vnp_OrderType: '270000'
} 
export const VNPAY_URL_PAY = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
export const phoneNumberRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
export const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
