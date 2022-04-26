import React, { Fragment, useEffect, useRef, useState } from 'react';
import {Button} from 'primereact/button';
import { useSelector } from 'react-redux';
import {DataScroller} from 'primereact/datascroller';
import {InputText} from 'primereact/inputtext'
import categoryService from '../../../service/category.service';
import statusCode from 'http-status-codes';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';



const Category = (props) => {
    const {categories} = useSelector(state=>state);
    //const {selectedCategory,setSelectedCategory} = useState();
    const [categoryNameInput,setCategoryNameInput] = useState('');
    const [categoryList,setCategoryList] = useState([]);
    const [categoryName,setCategoryName] = useState();
    
    const onFormSubmit = async (e)=>{
        global.loading.show(); 
        e.preventDefault();
        const res = await categoryService.create({name:categoryNameInput});
        switch (res.status) {
            case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Add', detail: 'Successfully', life: 1500});
                    setCategoryNameInput('');
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Add', detail: res.data.message, life: 1500});
                break;        
            default:
                break;
        }
        global.loading.hide(); 
    }
    const onClickUpdateHandler = async ({_id,name}) => {
        global.loading.show(); 
        const res = await categoryService.update({_id,name});
        switch (res.status) {
            case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Update', detail: 'Successfully', life: 1500});
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Update', detail: res.data.message, life: 1500});
                break;        
            default:
                break;
        }
        global.loading.hide(); 
    }
    const onClickDisableHandler = async (_id) => {
        global.loading.show(); 
        const res = await categoryService.disable({_id});
        switch (res.status) {
            case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Disable', detail: 'Successfully', life: 1500});
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Disable', detail: res.data.message, life: 1500});
                break;        
            default:
                break;
        }
        global.loading.hide(); 
    }
    const onClickEnableHandler = async (_id) => {
        global.loading.show(); 
        const res = await categoryService.enable({_id});
        switch (res.status) {
            case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Enable', detail: 'Successfully', life: 1500});
                break;
            case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Enable', detail: res.data.message, life: 1500});
                break;        
            default:
                break;
        }
        global.loading.hide(); 
    }
    const CategoryTemplate = (data) => {
        return (
            <div className='p-grid'>
                <div className='p-col-10 p-grid p-justify-start p-mt-1'>
                    <InputText className='p-col-11' value={categoryName[data._id]} onChange={(val)=>setCategoryName(prevData => {return {...prevData, [data._id]:val.target.value}})}/>
                </div>
                <div className='p-col-2 p-mt-1 p-grid p-jc-between'>
                    <Button className='p-col-5 p-button-raised p-button-info' type='button' onClick={()=>onClickUpdateHandler({_id: data._id, name: categoryName[data._id]})} icon="pi pi-save"/>
                    {data.status ? <Button className='p-col-5 p-button-raised p-button-danger' type='button' icon="pi pi-lock" onClick={()=>onClickDisableHandler(data._id)}/>
                    :  <Button className='p-col-5 p-button-raised p-button-secondary' type='button' icon="pi pi-lock-open" onClick={()=>onClickEnableHandler(data._id)}/>
                    }                
                </div>
            </div>      
        );
    }
    useEffect(()=>{
        setCategoryList(categories)
        setCategoryName((prevData)=>{
            let updateData = {};
            categories.forEach(category=>{
                updateData = {...updateData,[category._id]:category.name}
            });
            return updateData;
        })
    },[categories])
    return (
        <Fragment>
            <Tag value="Add new category" style={{backgroundColor:'#7a7a7a'}}/>
            <div className='p-grid p-justify-center p-mb-3' style={{backgroundColor:"white",boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>
                <div>

                </div>
                <div className='p-col-10 p-grid p-mb-4 p-mt-4'>
                    <InputText className='p-col-4' placeholder='Category name ...' value={categoryNameInput} onChange={(val)=>setCategoryNameInput(val.target.value)}/>
                    <form onSubmit={onFormSubmit}>
                        <Button className='p-button-raised p-button-success' type='submit' label="Add"/>
                    </form>
                </div>
            </div>
            <Tag value="List of category" style={{backgroundColor:'#7a7a7a'}}/>
            <div className='p-grid p-justify-center p-pt-6 p-pb-6' style={{backgroundColor:"white",boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>
                <div className='p-col-10 p-jc-center' style={{backgroundColor:"whitesmoke", boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 2px 5px 0 rgba(0, 0, 0, 0.19)'}}>
                    <DataScroller className='p-col-12' value={categoryList} itemTemplate={CategoryTemplate} rows={10000} buffer={0.4}/>
                </div>
            </div>
        </Fragment>
    );
}
export default Category;