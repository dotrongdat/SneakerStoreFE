import React,{useRef,useState,useEffect, Fragment, useImperativeHandle, forwardRef} from 'react';
import './ProductDetail.css';
import {Form,Button as BSButton} from 'react-bootstrap';
import {Button} from 'primereact/button';
import Validation from '../../Utils/Validation.utils';
import ProductRequestValidation from '../../Validations/ProductRequest.validation';
import BackButton from '../../Utils/Views/BackBtn';
import {Editor} from 'primereact/editor';
import {Dropdown} from 'primereact/dropdown';
import OrderImageList from '../../Utils/Views/OrderImagesList';
import FileUpload from '../../Utils/Views/FileUpload';
import productService from '../../../service/product.service';
import statusCode from 'http-status-codes';
import {useHistory} from 'react-router-dom';
import { useSelector } from 'react-redux';
import {InputText} from 'primereact/inputtext';


const DEFAULT_ERRORS_STATE={
    'name' : [],
    'description' : [],
    'detailDescription': [],
    'quantity': [],
    'price':[],
    'imageFile':[],
    'filesUpload':[]
}

let DEFAULT_ALBUM_STATE=[];
let DEFAULT_DROPDOWN_STATE='';
let DEFAULT_BLOG_STATE='';
const ProductCreate=(props,ref)=>{
    const [errors,setErrors]=useState(DEFAULT_ERRORS_STATE);
    const [blog, setBlog] = useState('');
    const [categoryOptions,setCategoryOptions]=useState([]);
    const [categoryDropdownValue,setCategoryDropdownValue]=useState(DEFAULT_DROPDOWN_STATE);
    const [album,setAlbum]=useState(DEFAULT_ALBUM_STATE);
    const [detailDescription,setDetailDescription] = useState([]);
    // const [detailDescriptionTitle,setDetailDescriptionTitle] = useState([]);
    // const [detailDescriptionContent,setDetailDescriptionContent] = useState([]);
    
    const albumRef=useRef();
    const nameInput=useRef();
    const descriptionInput=useRef();
    const brandInput=useRef();
    const quantityInput=useRef();
    const priceInput=useRef();
    const _useHistory = useHistory();
    const formRef = useRef();
    const createButtonRef = useRef();

    const {categories} = useSelector(state=>state);

    useImperativeHandle(ref,()=>({
        create: ()=> createButtonRef.current.click(),
        reset: ()=>{
            formRef.current.reset();
            albumRef.current.clear();
            setAlbum(DEFAULT_ALBUM_STATE);
            setCategoryDropdownValue(DEFAULT_DROPDOWN_STATE);
            setBlog(DEFAULT_BLOG_STATE);
            setErrors(DEFAULT_ERRORS_STATE);
        }
    }));

    const addErrors=(comp,errorMsg)=>{
        setErrors((prevData)=>{
            return {
                ...prevData,
                [comp]: errorMsg
            }
        })
    }
    const addDescriptionDetailFieldInput = () => {
        setDetailDescription(prevData=>{
            return [...prevData,{title:'',content: ''}]
        })
    }
    const removeDescriptionDetailFieldInput = (index) => {
        setDetailDescription(prevData=>{
            let updateData = [...prevData];
            updateData.splice(index,1);
            return updateData;
        })
    }
    const onSubmitHandler=async (e)=>{
        global.loading.show(); 
        e.preventDefault();
        let submitAlbum = [];
        album.map(i=>submitAlbum.push(i.name));    
        const createData={
            name: nameInput.current.value,
            category: categoryDropdownValue,
            brand: brandInput.current.value,
            description: descriptionInput.current.value,
            detailDescription: detailDescription.map(v=>JSON.stringify(v)),
            quantity: quantityInput.current.value,
            price: priceInput.current.value,
            album: submitAlbum,
            albumFile: albumRef.current.files,
            blog: blog
        }
        const validateReq = Validation(ProductRequestValidation.create(createData));
        console.log(validateReq.isValid);
        if(validateReq.isValid){                           
            const res= await productService.create(createData);
            switch (res.status){
                case statusCode.OK:
                    global.toast.show({severity:'success', summary: 'Create new product', detail: 'Successfully', life: 1500});
                    formRef.current.reset();
                    albumRef.current.clear();
                    setAlbum(DEFAULT_ALBUM_STATE);
                    setCategoryDropdownValue(DEFAULT_DROPDOWN_STATE);
                    setBlog(DEFAULT_BLOG_STATE);
                    setErrors(DEFAULT_ERRORS_STATE);
                    //props.onUpdate();
                    //_useHistory.replace(`admin/product/${res.data.payload._id}`);
                    break;
                case statusCode.UNAUTHORIZED:
                    _useHistory.replace('/signin');
                    break;
                case statusCode.INTERNAL_SERVER_ERROR:
                    global.toast.show({severity:'error', summary: 'Fail', detail: res.data.message, life: 1500});
                    break;
                default:
            }
        } else {
            setErrors((prevData)=>{
                let updateData={...prevData};
                for(let property in validateReq.errors){
                    updateData={...updateData,[property]:validateReq.errors[property]}
                }
                return updateData;
            });
        }
        global.loading.hide();
    }
    useEffect(()=>{
        window.scrollTo(0,0);
        setCategoryOptions(prevData =>{
            let categoryDropdownData=[];
            categories.forEach((category)=>{
                categoryDropdownData.push({
                    name: category.name,
                    value: category._id
                })
            });
            return categoryDropdownData;
        });
        setCategoryDropdownValue(categories[0]._id);       
    },[categories])
    return (
        <React.Fragment>       
        <Form className="product-detail" ref={formRef} onSubmit={onSubmitHandler}>
        <div className="p-grid p-justify-center">
            <div className='p-col-8 p-grid p-jc-center'>
                <div className='p-col-12 p-mt-6 p-pt-6'>
                    <OrderImageList items={album} onChange={setAlbum}/>
                </div>
                <div className='p-col-12 p-mt-6 p-pt-6'>
                    <FileUpload _ref={albumRef} 
                        onChoose={(items)=>{setAlbum(album.concat(items))}} 
                        onRemove={(item)=>setAlbum(album.filter((i)=>i.objectURL!==item))}
                        onClear={()=>setAlbum(album.filter((i)=>i.objectURL===undefined))}
                        multiple={true}
                        invalidFileHandler={addErrors}
                        errorLabel='filesUpload'                   
                    />
                    <Form.Text >
                        {errors.filesUpload.map((error,index)=>
                            <p key={index}>{error}</p>
                        )}                            
                    </Form.Text>
                </div>
            </div>
            
           
            <div className='product-detail_content p-col-10 p-mt-6'>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control ref={nameInput}/>
                        <Form.Text >
                        {errors.name.map((error,index)=>
                            <p style={{color:'red'}} key={index}>{error}</p>
                        )}                            
                        </Form.Text> 
                    </Form.Group>
                    <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Group>
                            <Dropdown style={{width:'100%'}} optionLabel="name"  options={categoryOptions} value={categoryDropdownValue} onChange={e=>{setCategoryDropdownValue(e.value)}}/>
                            </Form.Group>                            
                    </Form.Group>   
                    <Form.Group>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control ref={brandInput}/>                        
                    </Form.Group>                   
                    <Form.Group> 
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" aria-multiline='true' ref={descriptionInput}/>
                        <Form.Text >
                        {errors.description.map((error,index)=>
                            <p style={{color:'red'}} key={index}>{error}</p>
                        )}                            
                        </Form.Text>
                    </Form.Group>  
                    <Form.Group>  
                        <Form.Label>Detail Description</Form.Label>
                        
                            {
                                detailDescription.map((val,index)=>{
                                    return (
                                        <Form.Group key={index}>
                                            <InputText type="text" className="p-inputtext-sm block mb-2" placeholder='Input title' value={detailDescription[index].title} 
                                                onChange={e=>setDetailDescription(prevData=>{
                                                    let updateData = [...prevData];
                                                    updateData[index].title = e.target.value;
                                                    return updateData;
                                                })
                                            }/>
                                            <InputText type="text" className="p-inputtext-sm block mb-2" placeholder='Input content' value={detailDescription[index].content} 
                                                onChange={e=>setDetailDescription(prevData=>{
                                                    let updateData = [...prevData];
                                                    updateData[index].content = e.target.value;
                                                    return updateData;
                                                })
                                            }/>
                                            {/* <Button icon='pi pi-trash' className="p-button-warning" onClick={()=>removeDescriptionDetailFieldInput(index)} style={{}}/> */}
                                            <BSButton variant='warning' type='button' onClick={()=>removeDescriptionDetailFieldInput(index)}>Remove</BSButton>
                                        </Form.Group>
                                    )
                                })
                            }
                        <Form.Group>
                            <Button icon='pi pi-plus-circle' type='button' className="p-button-sm" label='Add' onClick={addDescriptionDetailFieldInput}/>
                        </Form.Group>
                    </Form.Group>      
                    <Form.Group>  
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" step="1" ref={quantityInput} min="0"/>
                        <Form.Text >
                        {errors.quantity.map((error,index)=>
                            <p style={{color:'red'}} key={index}>{error}</p>
                    )}                            
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" className="product-detail_price" step="1" ref={priceInput} />
                        <Form.Text >
                        {errors.price.map((error,index)=>
                            <p style={{color:'red'}} key={index}>{error}</p>
                        )}                            
                        </Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Blog</Form.Label>
                        <Editor style={{ height: '320px' }} value={blog} onTextChange={(e) => setBlog(e.htmlValue)}/>
                    </Form.Group>
                        <Button type="submit" hidden ref={createButtonRef}/>
                </div>
            </div>                           
        </Form>
        </React.Fragment>
    );    
}

export default forwardRef(ProductCreate);