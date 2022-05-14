import React from 'react';
import {FileUpload as FileUploadP} from 'primereact/fileupload';
import path from 'path';
import {validFileExtension, validFileType} from '../../Constant/ResourceConstant';

const FileUpload =(props) => {
    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly:true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly:true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};
    
    const onSelectTemplate = (e) =>{
        let valid=true;
        const _refItems=Object.values(props._ref.current.files);
        const _chooseItems=Object.values(e.files);
        const chooseItems=[];
        _refItems.map((file)=>{
            if(file.type.startsWith("image/",0)){
                if(_chooseItems.includes(file)) 
                chooseItems.push({
                    objectURL:file.objectURL,
                    name:file.name
                });
            }else valid=false;
        })
        !valid? props.invalidFileHandler(props.errorLabel,['File is invalid (only accept image file)']):props.invalidFileHandler(props.errorLabel,[]);
        props.onChoose(chooseItems);
    }
    const onRemoveTemplate = (e)=>{
        const _refItems=Object.values(props._ref.current.files);
        let valid=true;
        _refItems.map((file)=>{
            if(!(validFileExtension.includes(path.extname(file.name)) && file.type==='image/jpeg') && file!==e.file) 
            valid=false;
        })
        if(valid) props.invalidFileHandler(props.errorLabel,[]);
        props.onRemove(e.file.objectURL);
    }
    const onClearTemplate = (e) =>{
        props.onClear();
    }
    const headerTemplate = options =>{
        const {className, chooseButton, cancelButton} = options;
        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {cancelButton}
            </div>
        );
    }
    const emptyTemplate = () => <p className="p-m-0">Drag and drop files to here to upload.</p> ;        
    return (
        <div>
            <FileUploadP style={{fontSize:'70%'}} headerTemplate={headerTemplate} emptyTemplate={emptyTemplate} 
            chooseOptions={chooseOptions} cancelOptions={cancelOptions} 
            onSelect={onSelectTemplate} onRemove={onRemoveTemplate} onClear={onClearTemplate}
            ref={props._ref} multiple={props.multiple} accept="image/*" maxFileSize={1000000}/>
        </div>
    );
}

export default FileUpload;