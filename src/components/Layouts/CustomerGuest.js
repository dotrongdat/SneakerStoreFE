import React, { Fragment, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import ProductList from './ProductList';
import {useSelector} from 'react-redux';
import CustomRoute from '../Utils/CustomRoute.util';
import { roles } from '../Constant/CredentialConstant';
import SignIn from '../Views/SignIn';
import SignUp from '../Views/SignUp';
import ForgotPassword from '../Views/ForgotPassword';
import ProductDetail from './ProductDetail';
import { defaultParamValue, routeProductAPI } from '../Constant/ProductConstant';
import ProductDetail_Create from './ProductDetail_Create';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import Order from './Order';

const CustomerGuest = (props) => {

    const [productUrl,setProductUrl]=useState(routeProductAPI.search);
    const [params,setParams]=useState(defaultParamValue);
    const [page,setPage]=useState('0');
    const [totalPage,setTotalPage]=useState('0');
    const [searchData,setSearchData]=useState('');
    const [updateDataAction,setUpdateDataAction]=useState('');

    const {searchProducts} = useSelector(state=>state);
    const onUpdateDataHandler=()=>{
        setUpdateDataAction(!updateDataAction);
    }
    return (
        <div className='p-grid p-justify-center'>
            <div className='p-col-10' style={{position:'relative',zIndex:'0', minHeight:'80vh'}}>
                <Switch>
                    <Route path='/' exact>
                        {/* <TabMenu onChange={onChangeQueryValue} categoryParam={params.category}/>
                        <FilterBar onSubmit={onChangeQueryValue} params={params}/>   */}
                        <ProductList products={searchProducts}/>
                        {/* <CustomPagination url={productUrl} params={params} page={page} totalPage={totalPage}  onClickPageBtn={onChangeQueryValue}/> */}
                    </Route>
                    <CustomRoute status = {props.isCompleteInitUser} path='/signin' backPath='/' roles={[roles.NO_AUTH]} exact>
                        <SignIn/>
                    </CustomRoute>

                    <CustomRoute status = {props.isCompleteInitUser} path='/signup' backPath='/' roles={[roles.NO_AUTH]} exact>
                        <SignUp />
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/forgotpassword' backPath='/' roles={[roles.NO_AUTH]} exact>
                        <ForgotPassword/>
                    </CustomRoute>
                    <Route path={'/product/:_id'}>
                        <ProductDetail onUpdate={onUpdateDataHandler}/>
                    </Route>
                    {/* <CustomRoute status = {props.isCompleteInitUser} path='/product' backPath='/signin' roles={[roles.ADMIN]} exact>
                        <ProductDetail_Create onUpdate={onUpdateDataHandler}/>
                    </CustomRoute> */}
                    <CustomRoute status = {props.isCompleteInitUser} path='/cart' backPath='/signin' roles={[roles.CUSTOMER]}  exact>
                        <Cart/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/order' backPath='/signin' roles={[roles.CUSTOMER]}  exact>
                        <OrderHistory/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/order/:_id' backPath='/signin' roles={[roles.ADMIN]}  exact>
                        <Order/>
                    </CustomRoute>                   
                    
                    <Route>
                        <div style={{minHeight:'79vh'}}>
                            <h1>Not found</h1>
                        </div>   
                    </Route>
                </Switch>
            </div>
        </div>
    )
};

export default CustomerGuest;