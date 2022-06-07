import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import { DataGrid } from '@mui/x-data-grid';
import { SERVER_URL } from '../constants.js'
import { Alert, FormControl, FormLabel, Input, InputLabel, Snackbar, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class AddAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = { assignmentName: "", open: false, selectedDate: new Date(), courseId: props.location.courseId };
    };

    addAssignment = () => {
        const { selectedDate, assignmentName, courseId } = this.state;
        // const month = parseInt(selectedDate.getMonth()) + 1;
        // const formattedDate = selectedDate.getFullYear() + "-" + month + "-" + selectedDate.getDate();
        const formattedDate = selectedDate;
        console.log("Assignment.addAssignments");
        const token = Cookies.get('XSRF-TOKEN');
        fetch(`${SERVER_URL}/assignment/${courseId}`, {
            method: 'POST',
            headers: {'X-XSRF-TOKEN': token, "Accept": "application/json", "Content-Type": "application/json;charset=UTF-8"},
            body: JSON.stringify({
                "assignmentName": assignmentName,
                "dueDate": formattedDate
            }),
            credentials: 'include'
        })
            .then((responseData) => {
                //console.log(responseData);
                if (responseData.status === 200) {
                    this.setState({ open: true });
                } else {
                    toast.error("Add Assignment failed.", {
                        position: toast.POSITION.BOTTOM_LEFT
                    });
                }
            })
            .catch(err => console.error(err));
    }

    handleClick = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { open, selectedDate, assignmentName, courseId } = this.state;
        return (
            <div align="left" >
                <h4>Add Assignment </h4>
                <FormControl>
                    <InputLabel htmlFor="assignmentName">Assignment Name</InputLabel>
                    <Input id="assignmentName" name="assignmentName" aria-describedby="assignmentName" onChange={(e) => this.setState({ assignmentName: e.target.value })} />
                </FormControl>
                <br />
                <br />
                <FormControl>
                    <InputLabel htmlFor="dueDate">Due Date (YYYY-MM-DD)</InputLabel>
                    <Input id="dueDate" name="dueDate" aria-describedby="dueDate" onChange={(e) => this.setState({ selectedDate: e.target.value })} />
                    <br />
                    {/* <FormLabel>Due Date</FormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            views={['day', 'month', 'year']}
                            value={selectedDate}
                            onChange={(newValue) => {
                                this.setState({ selectedDate: newValue });
                            }}
                            renderInput={(params) => <TextField {...params} helperText={null} />}
                        />
                    </LocalizationProvider> */}
                    <Button color="primary" variant="outlined"
                        disabled={(assignmentName && courseId) ? false : true} style={{ margin: 10 }} onClick={() => this.addAssignment()}>
                        Add
                    </Button>
                </FormControl>
                <Snackbar
                    open={open}
                    autoHideDuration={2000}
                    onClose={this.handleClose}
                >
                    <Alert onClose={this.handleClose} severity="success" sx={{ width: '100%' }}>
                        Successfully added an Assignment!
                    </Alert>
                </Snackbar>
            </div>
        )
    }
}

export default AddAssignment;