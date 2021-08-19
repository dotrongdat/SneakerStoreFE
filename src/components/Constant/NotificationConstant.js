import {domain} from './APIConstant';

const notificationRouteAPI = {
    main: domain+'/api/notification'
}
const notificationStatus = {
    READ: 1,
    UN_READ: 0
}
const notificationType = {
    MESSAGE : 0,
    ORDER_REQUEST: 1
}

export {
    notificationRouteAPI,
    notificationType,
    notificationStatus
} 