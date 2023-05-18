import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridApiRef, useGridApiRef } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import "../css/AdminPanel.css"
import { toast } from 'react-toastify';

const AdminPanel = () => {
    const [lakesData, setLakesData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const apiRef = useGridApiRef();

    useEffect(() => {
        const fetchLakesData = async () => {
            try {
                const response = await fetch('http://localhost:5000/admin/lakes', {
                    method: 'GET',
                    headers: { token: localStorage.token },
                });
                const data = await response.json();
                setLakesData(data);
            } catch (error) {
                console.error('Error fetching lake data:', error);
            }
        };

        fetchLakesData();
    }, []);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 150, editable: true },
        { field: 'x', headerName: 'X', width: 150 },
        { field: 'y', headerName: 'Y', width: 150 },
        {
            field: 'isRented',
            headerName: 'Rented',
            width: 110,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    onChange={async (e) => {
                        const updatedValue = e.target.checked;
                        const updatedLakesData = lakesData.map((lake) =>
                            lake.id === params.id ? { ...lake, isRented: updatedValue } : lake
                        );
                        setLakesData(updatedLakesData);
                        await handleEdit({ id: params.id, field: 'isRented', value: updatedValue });
                    }}
                />
            ),
        },
        {
            field: 'isPrivate',
            headerName: 'Private',
            width: 110,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    onChange={async (e) => {
                        const updatedValue = e.target.checked;
                        const updatedLakesData = lakesData.map((lake) =>
                            lake.id === params.id ? { ...lake, isPrivate: updatedValue } : lake
                        );
                        setLakesData(updatedLakesData);
                        await handleEdit({ id: params.id, field: 'isPrivate', value: updatedValue });
                    }}
                />
            ),
        },
    ];

    const handleDelete = async () => {
        try {
            
            const deletePromises = selectedRows.map((id) =>
                fetch(`http://localhost:5000/admin/lakes/${id}`, {
                    method: 'DELETE',
                    headers: { token: localStorage.token },
                })
            );

            const deleteResponses = await Promise.all(deletePromises);
            const failedDeletes = deleteResponses.filter((res) => res.status !== 200);

            if (failedDeletes.length > 0) {
                toast.error('Error deleting some lakes');
                throw new Error('Error deleting some lakes');
                
            }
  
            toast.success('Lakes deleted successfully');
            const updatedLakesData = lakesData.filter((lake) => !selectedRows.includes(lake.id));
            setLakesData(updatedLakesData);
            setSelectedRows([]);
        } catch (error) {
            toast.error('Error deleting lakes');
        }
    };

    const handleEdit = async (params) => {
        try {
            const { id, field, value } = params;
            const response = await fetch(`http://localhost:5000/admin/lakes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.token,
                },
                body: JSON.stringify({ [field]: value }),
            });

            if (response.status !== 200) {
                toast.error('Error updating lake');
                throw new Error('Error updating lake');
            }

            
            toast.success('Lake updated successfully');
        } catch (error) {
            toast.error('Error updating lake');
        }
    };



    return (
        <div className="adminPanel">
            <Box className="adminBox" sx={{ height: '80%', width: '90vw' }}>
                <DataGrid
                    rows={lakesData}
                    columns={columns}
                    className="adminTable"
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 10,
                            },
                        },
                    }}
                    pageSizeOptions={[10, 15, 20]}
                    checkboxSelection
                    disableSelectionOnClick
                    disableRowSelectionOnClick
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                        setSelectedRows(newRowSelectionModel);
                        
                    }}
                    onEditCellChangeCommitted={handleEdit}
                />
            </Box>
            <Button variant="contained" color="primary" onClick={handleDelete}>
                Delete Selected
            </Button>
        </div>
    );
};

export default AdminPanel;