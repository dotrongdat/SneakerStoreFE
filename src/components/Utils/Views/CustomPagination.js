import React from 'react';
import {Pagination} from 'react-bootstrap';
import './CustomPagination.css';

const CustomPagination=(props)=>{
    let items=[];
    const totalPage=props.totalPage;
    const onClickHandler= (e)=>{
        const page=e.target.text;
        if(page) props.onClickPageBtn({page});
    }
    for (let index = 1; index <=totalPage; index++) {
        items.push(
            <Pagination.Item key={index} active={props.page==index} onClick={onClickHandler}>
                {index}
            </Pagination.Item>
        );
    }
    return (
        <div className="custom-pagination">
             <Pagination className="custom-pagination_groupBtn">{items}</Pagination>
        </div>
    );
}
export default CustomPagination;