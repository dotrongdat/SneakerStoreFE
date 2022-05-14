import React, { Fragment, useEffect, useState } from 'react';
import { Route, Switch, useHistory} from 'react-router-dom';
import ProductList from './ProductList';
import {useSelector} from 'react-redux';
import CustomRoute from '../Utils/CustomRoute.util';
import { roles } from '../Constant/CredentialConstant';
import SignIn from '../Views/SignIn';
import SignUp from '../Views/SignUp';
import ForgotPassword from '../Views/ForgotPassword';
import ProductDetail from './ProductDetail';
//import { defaultParamValue, ITEM_PER_PAGE, routeProductAPI } from '../Constant/ProductConstant';
import ProductDetail_Create from './ProductDetail_Create';
import Cart from './Cart';
import OrderHistory from './OrderHistory';
import Order from './Order';
import CustomPagination from '../Utils/Views/CustomPagination';
import SearchBar from './SearchBar';
import { Redirect } from 'react-router-dom';
import Breadcrumb from '../Utils/Views/Breadcrumb';
import Home from './Home';
import './User.css';
import { BACKGROUND_COLOR } from '../Constant';
import { PageNotFound } from '../Commons/ErrorPage';
import CheckOutResult from './CheckOutResult';

const User = (props) => {

    // const [productUrl,setProductUrl]=useState(routeProductAPI.search);
    // const [params,setParams]=useState(defaultParamValue);
    // const [page,setPage]=useState('0');
    // const [totalPage,setTotalPage]=useState('0');
    // const [productList,setProductList] = useState([]);

    // const [searchData,setSearchData]=useState('');
    // const [updateDataAction,setUpdateDataAction]=useState('');

    const {searchProducts} = useSelector(state=>state);
    const _useHistory = useHistory();
    // const onUpdateDataHandler=()=>{
    //     setUpdateDataAction(!updateDataAction);
    // }
    //const onChangeQueryValue = ()=>{};
    // useEffect(()=>{
    //     setProductList(searchProducts);
    //     setTotalPage(Math.ceil(searchProducts.length/ITEM_PER_PAGE));
    // },[searchProducts])
    return (
        <Fragment>  
            <div className='p-grid p-justify-center' style={{marginRight: '1px',backgroundColor: BACKGROUND_COLOR}}>
                <div className='center  p-mt-2 p-col-8' style={{position:'relative',zIndex:'0', minHeight:'83vh'}}>
                    <SearchBar/>
                    
                    <Switch>
                        <Route path={['/']} exact>
                            {/* <TabMenu onChange={onChangeQueryValue} categoryParam={params.category}/>
                            <FilterBar onSubmit={onChangeQueryValue} params={params}/>   */}
                            <Home/>
                            {/* <CustomPagination page={page} totalPage={totalPage}  onClickPageBtn={onChangeQueryValue}/> */}
                        </Route>
                        <Route path={['/search','/category','/product/:_id']} exact>
                            <Breadcrumb ref={r=>global.breadcrumb = r}/>
                            <Route path={['/search','/category']} exact>
                                <ProductList/>
                            </Route>
                            <Route path={'/product/:_id'} exact>
                                <ProductDetail/>
                            </Route>
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
                        {/* <Route path={'/product/:_id'}>
                            <Breadcrumb ref={r=>global.breadcrumb = r}/>
                            <ProductDetail/>
                        </Route> */}
                        {/* <CustomRoute status = {props.isCompleteInitUser} path='/product' backPath='/signin' roles={[roles.ADMIN]} exact>
                            <ProductDetail_Create onUpdate={onUpdateDataHandler}/>
                        </CustomRoute> */}
                        <CustomRoute status = {props.isCompleteInitUser} path='/cart' backPath='/signin' roles={[roles.NO_AUTH,roles.CUSTOMER]}  exact>
                            <Cart/>
                        </CustomRoute>
                        <CustomRoute status = {props.isCompleteInitUser} path='/order' backPath='/signin' roles={[roles.CUSTOMER]}  exact>
                            <OrderHistory/>
                        </CustomRoute>
                        {/* <CustomRoute status = {props.isCompleteInitUser} path='/order/:_id' backPath='/signin' roles={[roles.ADMIN]}  exact>
                            <Order/>
                        </CustomRoute>    */}
                        <Route path='/checkoutResult' exact>
                            <CheckOutResult/>
                        </Route>                 
                        <Route>
                            <Redirect to={'/pageNotFound'}/>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Fragment>
    )
};

export default User;