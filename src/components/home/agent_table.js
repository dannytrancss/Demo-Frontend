import React, { useState, useEffect } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography, message, Rate } from 'antd';
import moment from 'moment';
import {EditTwoTone, DeleteTwoTone} from '@ant-design/icons'

// Setup a row to table
const AgentDetailCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber min = "0" /> : <Input />;
  return (
    <td {...restProps} key="id">
      {editing ? (
          <span>
            {
            (dataIndex === 'email') ?
            <Form.Item
                name={dataIndex}
                style={{
                    margin: 0,
                }}
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid email!',
                    },
                    {
                        required: true,
                        message: `Please Input ${title}!`,
                    },
                ]}
            >
            {inputNode}
            </Form.Item>
            :
            (dataIndex === 'reviews') ?
            <Form.Item
                name={dataIndex}
                style={{
                    margin: 0,
                }}
                rules={[
                    {
                        required: true,
                        message: `Please Input ${title}!`,
                    },
                ]}
            >
            <Rate value={record.reviews}></Rate>
            </Form.Item>
            :
            <Form.Item
                name={dataIndex}
                style={{
                    margin: 0,
                }}
                rules={[
                    {
                    required: true,
                    message: `Please Input ${title}!`,
                    },
                ]}
                >
                {inputNode}
            </Form.Item>
          }
        </span>
            
      ) : (
        children
      )}
    </td>
  );
};

// Create a AgentTable component
const AgentTable = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [agentId, setAgentId] = useState(null);

    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [totalRecords, setTotalRecords] = useState(0)

    // call api to get list of agents
    const getAllAgents = (pageNumber, pageSize)=>{
        const url = `https://localhost:44389/agents?PageNumber=${pageNumber}&PageSize=${pageSize}`
        fetch(url)
        .then(response=>response.json())
        .then(agents=>{
            setDataSource(agents.data)
            setPage(agents.pageNumber)
            setPageSize(agents.pageSize)
            setTotalRecords(agents.totalRecords)
        })
        .catch(err=>{console.log(err)})
        .finally(()=>{setLoading(false)})
    }

    useEffect(()=>{
        setLoading(true)
        getAllAgents(page, pageSize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
        id: '',
        name: '',
        email: '',
        totalProjectsDelivered: '',
        reviews:'',
        joinedDate:'',
        ...record,
    });
    setEditingKey(record.id);
  };

  // Reset editing row
  const cancel = () => {
    setEditingKey('');
  };

  // Save updating data
  const save = async (id) => {
    try {
      const row = await form.validateFields();
      const newData = [...dataSource];
      const index = newData.findIndex((item) => id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        saveUpdate(newData[index])
        setEditingKey('');
      } else {
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  //For updating. Call api to update data into DB
  const saveUpdate =(updateDate)=>{
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateDate)
    };
    fetch(`https://localhost:44389/agents`, requestOptions)
        .then(response => response.json())
        .then(data=>
        {
            if(data.succeeded === true){
                message.success("Updated successfully.");
                getAllAgents(page, pageSize);
            }
            else{
                message.error("Updated unsuccessfully.");
            }
        })
        .catch(err =>{
            console.log(err);
            message.error("Something went wrong.");
        })
  }

  // For deleting. Call api to delete data from DB
  const confirmDelete = (e)=> {
    fetch(`https://localhost:44389/agents/${agentId}`, {method: "DELETE"})  
        .then(response => response.json()) 
        .then(data=>
        {
            if(data.succeeded === true){
                message.success("Deleted successfully.");
                getAllAgents(page, pageSize);
            }
            else{
                message.error("Deleted unsuccessfully.");
            }
        })
        .catch(err =>{
            console.log(err);
            message.error("Something went wrong.");
        })
  }

  // Set columns to table
  const columns = [
    {
        key:"1",
        title:"Name",
        dataIndex:"name",
        editable:true
    },
    {
        key:"2",
        title:"Email",
        dataIndex:"email",
        editable:true
    },
    {
        key:"3",
        title:"Total Delivered Projects",
        dataIndex:"totalProjectsDelivered",
        editable:true
    },
    {
        key:"4",
        title:"Reviews",
        dataIndex:"reviews",
          render:(reviews)=>{
            return <Rate value={reviews}></Rate>
        }, 
        editable:true
    },
    {
        key:"5",
        title:"Joined Date",
        dataIndex:"joinedDate",
       render:(joinedDate)=>{
            const date = moment(new Date(joinedDate));
            return date.format("DD-MMM-YYYY")
       },
    },
    {
        key:"6",
        title: 'Action',
        dataIndex: 'operation',
        render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {/* eslint-disable-next-line */}
            <a href="#" className="agent-block-save"
              onClick={() => save(record.id)}
              /* style={{
                marginRight: 8,
              }} */
            >
              Save
            </a>
            <Popconfirm title="Are you sure to cancel?" onConfirm={cancel}>
              {/* eslint-disable-next-line */}
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
            <span>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                Edit <EditTwoTone />
            </Typography.Link>

            <Popconfirm
            title="Are you sure to delete this agent?"
            onConfirm={confirmDelete}
            //onCancel={cancelDelete}
            okText="Yes"
            cancelText="No">
            {/* eslint-disable-next-line */}
            <a href="#" style={{padding:10}}>Delete <DeleteTwoTone/></a>
            </Popconfirm>
            </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: (col.dataIndex === 'reviews' || col.dataIndex === 'totalProjectsDelivered') ? 
                    'number' : (col.dataIndex === 'email') ? 'email' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

// Render a table
  return (
    <div id="table" className="block agent-block">
    <div className="container-fluid">
    <Form form={form} component={false}>
      <Table
      rowKey="id"
        components={{
          body: {
            cell: AgentDetailCell,
          },
        }}
        bordered
        dataSource={dataSource}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
            current:page,
            pageSize:pageSize,
            total:totalRecords,
            onChange:(pageNumber, pageSize) =>{
                setPage(pageNumber);
                setPageSize(pageSize)
                //Make an api call with page and page size
                getAllAgents(pageNumber, pageSize)
            }
        }}
        loading={loading}
        onRow={rowData => ({
            onClick: () => {
              setAgentId(rowData.id);
            },
        })}
      />
    </Form>
    </div>
    </div>
  );
};

export default AgentTable