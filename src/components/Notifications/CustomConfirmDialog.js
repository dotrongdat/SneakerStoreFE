import {confirmDialog} from 'primereact/confirmdialog';

// eslint-disable-next-line import/no-anonymous-default-export
export default (message,title,accept,reject=()=>{})=>{
    const config={
        message,
        header : title,
        icon: 'pi pi-info-circle',
        acceptClassName: 'p-button-danger',
        accept,
        reject
    }
    return confirmDialog(config); 
}