import React, {useRef} from 'react';
import {useHistory} from 'react-router-dom';
import './SearchBar.css';
import {InputText} from 'primereact/inputtext';
import {Button} from 'primereact/button';
import {Badge} from 'primereact/badge';
import {useSelector} from 'react-redux';
import { roles } from '../Constant/CredentialConstant';

const SearchBar = (props) => {
    const _useHistory = useHistory();
    const inputText=useRef();
    const {user,isSignIn} = useSelector(state=>state);
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
    }
    const onClickShoppingCartHandler = (e) =>{
        _useHistory.replace('/cart');
    }
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
    }

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
    return (
        <div className="search-bar">
        <form onSubmit={onSubmitHandler}>
            <div className="p-grid p-justify-center" style={{paddingTop:'0.3vh',margin:'0px'}}>            
                <div className="p-col-8 p-inputgroup">
                        {homeButton()}
                        {searchInput()}
                        {user.role !== roles.ADMIN && cartButton()}
                </div>
            </div>                   
        </form>
        </div>
    );
}
export default SearchBar;