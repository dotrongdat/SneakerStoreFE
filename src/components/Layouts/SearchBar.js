import React, {useEffect, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import './SearchBar.css';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Badge} from 'primereact/badge';
import {useSelector} from 'react-redux';
import { roles } from '../Constant/CredentialConstant';
import {TieredMenu} from 'primereact/tieredmenu';
import productService from '../../service/product.service';

const SearchBar = (props) => {
    const _useHistory = useHistory();
    const inputText=useRef();
    const menuRef = useRef(null);
    const {user,isSignIn,categories} = useSelector(state=>state);
    const [categoryItems,setCategoryItems] = useState([]);
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const params={
            name:inputText.current.value,
            page:1,
            sortBy:'name',
            priceFrom: 0,
            priceTo:Number.MAX_SAFE_INTEGER,
            inc: true
        }
        await props.onSubmit(params,['category']);
        _useHistory.replace('/');
    };
    const onClickShoppingCartHandler = (e) =>{
        _useHistory.replace('/cart');
    };
    const onClickHomeHandler = async ()=> {
        await props.onSubmit({
            name:'',
            page:1,
            sortBy:'name',
            priceFrom: 0,
            priceTo:Number.MAX_SAFE_INTEGER,
            inc: true
        },['category']);
        _useHistory.replace('/');
    };

    const cartButton = () =>{
        return (
            <i  className='pi pi-shopping-cart p-text-secondary p-overlay-badge' 
                style={{marginLeft:'2vw',marginTop:'0.4vh',cursor:'pointer',fontSize:'2rem'}} 
                onClick={onClickShoppingCartHandler}>
                {isSignIn && user.cart.length>0  && <Badge value={user.cart.length} severity='info'></Badge>}
            </i> 
        );
    }
    const homeButton = () => <Button className='p-button-rounded p-button-secondary' type='button' icon='pi pi-home' style={{marginRight:'2vw'}} onClick={onClickHomeHandler}/>
    const searchInput = ()=>{
        return (
            <React.Fragment>
                <InputText placeholder="Search ..." ref={inputText}/>
                <Button type='submit' icon="pi pi-search" className="p-button-warning"/>
            </React.Fragment>
        );
    }
    const overlayMenu = () => {
        return (
            <React.Fragment>
                <TieredMenu id='overlay_menu' model={categoryItems} ref={menuRef} popup/>
                <Button type='button' label="Category" icon="pi pi-bars" onClick={(event) => menuRef.current.toggle(event)} aria-haspopup aria-controls="overlay_menu"/>
            </React.Fragment>
        )
    }
    useEffect(()=>{
        setCategoryItems((prevData)=>{
            let updateData = [];
            categories.forEach((category)=>{
                if(category.status){
                    updateData.push({
                        label: category.name,
                        command: ()=>{
                            productService.findByCategory(category._id);
                            _useHistory.push("/product");
                        }
                    });
                }
               
            })
            return updateData;
        })
    },[categories]);
    return (
        <div className="search-bar">
        <form onSubmit={onSubmitHandler}>
            <div className="p-grid p-justify-center" style={{paddingTop:'0.3vh',margin:'0px'}}>            
                <div className="p-col-8 p-inputgroup">
                        {/* {homeButton()} */}
                        {overlayMenu()}
                        {searchInput()}
                        {user.role !== roles.ADMIN && cartButton()}
                </div>
            </div>                   
        </form>
        </div>
    );
}
export default SearchBar;