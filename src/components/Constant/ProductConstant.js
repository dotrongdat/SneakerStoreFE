import {domain} from './APIConstant';

export const routeProductAPI={
    main: domain+'/api/product',
    search: domain+'/api/product/search'
    
}

export const validRangeValue={
    name:{min:1,max:30},
    price:{min:1,max:1000000000000},
    quantity:{min:0,max:1000000},
    description:{min:0,max:2000},
    publishedYear:{min:1800,max:new Date().getFullYear()},
}
export const defaultParamValue={
    name:'',
    priceFrom: 0,
    priceTo: Number.MAX_SAFE_INTEGER,
    sortBy: 'name',
    inc:true,
    page:1,
    itemPerPage: 12
}