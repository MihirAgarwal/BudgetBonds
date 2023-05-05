import React from "react";
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import { Grid } from '@mui/material';
import Option from '@mui/joy/Option';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack'
import { Link } from 'react-router-dom';

const AddGroup = () => {
    const [groupName,setGroupName] = React.useState("");
    return (
        <div style = {{marginTop:"5rem",marginLeft:"40%"}}>
            <div className="GroupName Input">
                <Input
                    placeholder="Group Name"
                    sx={{ width: 250 ,
                        mb : 2}}
                    value={groupName}
                    onChange={(e)=>{setGroupName(e.target.value)}}
                />
            </div>
            <div className='AddGroupButtons'>
                <Stack direction="row" spacing={2}>
                <Button variant="contained" color="success">
                    Add Group
                </Button>
                <Link exact to="/groups"><Button variant="outlined" color="error">
                    Cancel
                </Button></Link>  
                
                </Stack>
            </div>
        </div>
    )
}

export default AddGroup;