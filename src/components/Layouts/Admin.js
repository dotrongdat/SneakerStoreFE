import React, { useState } from 'react';
import {PanelMenu} from 'primereact/panelmenu';
import {useHistory} from 'react-router-dom';
import {Switch} from 'react-router-dom';
import CustomRoute from '../Utils/CustomRoute.util';
import { roles } from '../Constant/CredentialConstant';
import ProductDetail_Create from './ProductDetail_Create';
import Category from './admin/Category';
import Product from './admin/Product';

const Admin = (props) => {
    const _useHistory = useHistory();
    const [updateDataAction,setUpdateDataAction]=useState('');
    const items = [
        {
            label: "Order Management",
            icon: "pi pi-pw pi-envelope",
            items: [
                {
                    label: "All Order",
                    command: ()=>{}
                },
                {
                    label: "Processing Order"
                }
            ]
        },
        {
            label: "Shop Management",
            icon: "pi pi-pw pi-tag",
            items: [
                {
                    label: "Product Management",
                    command: ()=> {_useHistory.push('/admin/product')}
                },
                {
                    label: "Category Management",
                    command: ()=> {_useHistory.push('/admin/category')}
                }
            ]
        },{
            label: "Finance",
            icon: "pi pi-pw pi-wallet",
            items: [
                {
                    label: "Turnover",
                    command: ()=>{}
                },
                {
                    label: "Wallet",
                    command: ()=>{}
                },
                {
                    label: "Banking",
                    command: ()=>{}
                }
            ]
        }
    ]
    const onUpdateDataHandler=()=>{
        setUpdateDataAction(!updateDataAction);
    }
    return (
        <div className='p-grid p-justify-center p-mt-1' style={{marginRight: '1px'}}>
            <PanelMenu multiple={true} model={items} style={{width: "16v", position: 'absolute', left: 0}}/>            
            <div className='p-col-7' style={{minHeight:'82.3vh', backgroundColor: "whitesmoke"}}>
                <Switch>
                    <CustomRoute status = {props.isCompleteInitUser} path='/product' backPath='/' roles={[roles.ADMIN]} exact>
                        <ProductDetail_Create onUpdate={onUpdateDataHandler}/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/admin/category' backPath='/' roles={[roles.ADMIN]}  exact>
                        <Category/>
                    </CustomRoute>
                    <CustomRoute status = {props.isCompleteInitUser} path='/admin/product' backPath='/' roles={[roles.ADMIN]}  exact>
                        <Product/>
                    </CustomRoute>
                </Switch>
            </div>
        </div>
    )
}

export default Admin;