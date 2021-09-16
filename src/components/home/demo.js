import React, {useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import {Rate, Row, Table} from 'antd';
import moment from 'moment'; 

function DemoTable() {

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)

    const getAllAgents = (pageNumber, pageSize)=>{
        const url = `https://localhost:44389/agents?PageNumber=${pageNumber}&PageSize=${pageSize}`
        fetch(url)
        .then(response=>response.json())
        .then(agents=>{
            setDataSource(agents.data);
            setPage(agents.page);
            setPageSize(agents.pageSize)
            setTotalRecords(agents.totalRecords)
            console.log(agents.data);
        })
        .catch(err=>{console.log(err)})
        .finally(()=>{setLoading(false)})
    }

    
    useEffect(
        ()=>{
            setLoading(true)
            getAllAgents(page, pageSize)
        // eslint-disable-next-line react-hooks/exhaustive-deps
        },[]
    )

    const columns =[
        {
            key:"1",
            title:"Name",
            dataIndex:"name"
        },
        {
            key:"2",
            title:"Email",
            dataIndex:"email",
        },
        {
            key:"3",
            title:"Total Delivered Projects",
            dataIndex:"totalProjectsDelivered"
        },
        {
            key:"4",
            title:"Reviews",
            dataIndex:"reviews",
            render:(reviews)=>{
                return <Rate value={reviews}></Rate>
            }
        },
        {
            key:"5",
            title:"Joined Date",
            dataIndex:"joinedDate",
           render:(joinedDate)=>{
                const date = moment(new Date(joinedDate));
                return date.format("DD-MMM-YYYY")
           }

        },
    ]
    return (
        <div id="agents" className="block contactBlock">
        <div className="container-fluid">
            <Table
            key={Row.id}
            loading={loading}
            columns={columns}
            dataSource={dataSource}
            pagination={{
                current:page,
                pageSize:pageSize,
                total:totalRecords,
                onChange:(page, pageSize) =>{
                    setPage(page);
                    setPageSize(pageSize)
                    //Make an api call with page and page size
                    getAllAgents(page, pageSize)
                }
            }}
            >
            </Table>
        </div>
        </div>
    )
}
export default DemoTable