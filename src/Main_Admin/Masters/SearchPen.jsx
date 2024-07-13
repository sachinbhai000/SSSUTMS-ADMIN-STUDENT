  import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  TableCell,
  Box,
  CircularProgress
} from "@mui/material";
import axios from "axios";
import closebutton from "../../images/close-button.png"
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useParams } from 'react-router-dom';
import CardContent from "@mui/material/CardContent";
import swal from "sweetalert";
import AdminDashboard from "./Admin_Dashboard/AdminDashboard";
// import Sidebar from "./Sidebar";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";

const theme = createTheme({
  typography: {
    fontWeightBold: 700,
  },
});

const SearchPen = ({admissionSession, courseType, courseName, courseBranch, assignedCollege}) => {
  const [page, setPage] = React.useState(0);
  const [rows, setRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [studentdata1, setStudentData] = useState({ students: [] });
  const [dataNotFound, setDataNotFound] = useState(false);
  const [enrollmentGenerated, setEnrollmentGenerated] = useState(false);
  const [collegeAssignments, setCollegeAssignments] = useState({});
  const [assignedCollegee, setAssignedCollegee] = useState();
  const [loading, setLoading] = useState(false)

  // const { admissionSession, courseType, courseName, courseBranch } = useParams();
  // console.log(admissionSession, courseType, courseName, courseBranch, "data from query")
  console.log(admissionSession, courseType, courseName, courseBranch, assignedCollege,"adminPenSearch")
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
      const url = process.env.REACT_APP_STD_PEND_LIST;

        const requestData = {
          admissionSession,
          courseType,
          courseName,
          courseBranch,
          assignedCollege
        };

        const response = await axios.post(url, requestData);

        const data = response.data;
        console.log(data, "data from apiiiiiiiiiiiiiii")
        if (!data.students || data.students.length === 0) {
          setDataNotFound(true);
        } else {
          setDataNotFound(false);
          setStudentData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setDataNotFound(true);
      } finally {
        setLoading(false)
      }
    };

    // Call the fetchData function whenever any of the dependencies (session, courseType, etc.) change
    fetchData();
  }, [admissionSession, courseType, courseName, courseBranch, assignedCollege]);

  const branch1 = courseBranch;

  const AYURVEDIC = "AYURVEDIC MEDICINE AND SURGERY";

  const collegeOptions = {
    HOMEOPATHY: ["School of Homeopathy"],
    AYURVEDIC: ["School of Ayurveda and Siddha Studies"],
  };
 // Check if branch1 is defined and is a string before splitting
const branchFirstWord = branch1 && typeof branch1 === 'string' ? branch1.split(' ')[0] : '';

  console.log(branchFirstWord, 'ding ding ding ')
  console.log("College Options:", collegeOptions[branchFirstWord]);
  const handleCollegeChange = (studentId, collegeName) => {
    setCollegeAssignments((prevAssignments) => {

      setAssignedCollegee(collegeName);
      return {
        ...prevAssignments,
        [studentId]: collegeName,
      };
    });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


  // ////////////////////////////////////////////////////////////////////////////////////////
  const handleCancel = async (studentId) => {
    // console.log(studentId , 'student ki id ')
    try {
      const response = await axios.post(
        process.env.REACT_APP_STD_CANCEL,
        {
          studentId,
        }
      );

      // console.log(response, "cancel api")
      swal({
        title: "Success",
        text: "Request Cancelled Successfully!",
        icon: "success",
        buttons: "OK",
      });

    } catch (error) {
      console.error(error);
    }
    // Filter out the canceled student from the student data
    const updatedStudents = studentdata1.students.filter(student => student._id !== studentId);

    // Update the state with the filtered student data
    setStudentData(prevState => ({
      ...prevState,
      students: updatedStudents
    }));
  };


  /////////////////////datepicker/////////////////
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // console.log(studentdata, "data of student from use state")
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const branchname = studentdata1[0]?.courseBranch
  const coursename = studentdata1[0]?.courseName
  const studentId = studentdata1[0]?._id
  //   const collegename = studentdata1[0]?.assignedCollege
  // console.log(branchname, coursename, collegename, ' message from K4LI  ..............')
  console.log("approve request");
  const handleClick = async (id) => {
    console.log(id, "id inside handleClcic")
    try {
      const response = await axios.put(process.env.REACT_APP_STD_APPROVE, {
        studentId: id,
        assignedCollege,
      });
      console.log(response.data.message,"approve request");
      swal({
        title: "Success",
        text: "Approved Successfully!",
        icon: "success",
        buttons: "OK",
      });
      // Set enrollmentGenerated to true and reset state values
      setEnrollmentGenerated(true);
      setStudentData([]);
    } catch (error) {
      // console.log(error)
    }

  }
  console.log(studentdata1, "helllo world")
  return (
    <ThemeProvider theme={theme}>
      <AdminDashboard />
      <>
        <Box sx={{ width: "90%", marginLeft: "100px", marginTop: "100px" }}>
          {loading ? (<CircularProgress color="inherit" style={{ marginTop: "70px", marginLeft: "50%" }}/>): (
          <CardContent>
            {dataNotFound ? (
              <div>
                <h2>Oops! No Student Available in this Course!!!!</h2>
              </div>
            ) : (

              <Paper sx={{ width: "100%", overflow: 'auto' }}>
                <TableContainer sx={{ maxHeight: "440px" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}

                        >
                          <h5>
                                <b>S.No.</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Session</b>
                          </h5>
                        </TableCell>

                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Registration No.</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white', minWidth: '200px' }}>


                          <h5>
                            <b>Student Name</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b> Email</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Date of Birth</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Father's Name</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Mother's Name</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Contact</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Nationality</b>
                          </h5>
                        </TableCell>

                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Qualification</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", minWidth: '150px', color: 'white' }}
                        >
                          <h5>
                            <b>Qualification %</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white' }}
                        >
                          <h5>
                            <b>Course Type</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", color: 'white', minWidth: '200px' }}
                        >
                          <h5>
                            <b>Course Name</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", minWidth: '200px', color: 'white' }}
                        >
                          <h5>
                            <b>Course Branch</b>
                          </h5>
                        </TableCell>
                        <TableCell
                          align="left"
                          style={{ backgroundColor: "#004e92", minWidth: '200px', color: 'white' }}
                        >
                          <h5>
                            <b>Assign College</b>
                          </h5>
                        </TableCell>

                        <TableCell
                          align="center"
                          style={{ backgroundColor: "#004e92", minWidth: '200px', color: 'white' }}
                        >
                          <h5>
                            <b>View Marksheet</b>
                          </h5>
                        </TableCell>


                        <TableCell
                          align="center"
                          style={{ backgroundColor: "#004e92", minWidth: '200px', color: 'white' }}
                        >
                          <h5>
                            <b>Action</b>
                          </h5>
                        </TableCell>


                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentdata1 && studentdata1.students && studentdata1.students.map((student, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{index + 1}</TableCell>

                          <TableCell align="left">{student.admissionSession}</TableCell>
                          <TableCell align="center">
                            {student.randomId}
                          </TableCell>
                          <TableCell align="left">{student.name}</TableCell>
                          <TableCell align="left">{student.email}</TableCell>
                          <TableCell align="left">
                            <DatePicker
                              selected={selectedDate || new Date(student.dob)}
                              onChange={(date) => handleDateChange(date)}
                              dateFormat="dd/MM/yyyy"
                              className="text-center"
                            />
                          </TableCell>
                          <TableCell align="left">{student.fathersname}</TableCell>
                          <TableCell align="left">{student.mothersname}</TableCell>
                          <TableCell align="left">{student.mobile}</TableCell>
                          <TableCell align="left">{student.domicile}</TableCell>
                          <TableCell align="left">
                            {student.qualification}
                          </TableCell>
                          <TableCell align="left">
                            {`${student.qualificationPercentage}%`}
                          </TableCell>

                          <TableCell align="left">{student.courseType}</TableCell>
                          <TableCell align="left">{student.courseName}</TableCell>
                          <TableCell align="left">{student.courseBranch}</TableCell>
                          <TableCell align="center">
                            <Form.Select
                              style={{ height: "40px", width: "45vh" }}
                              value={collegeAssignments[student._id] || ""}
                              onChange={(e) =>
                                handleCollegeChange(student._id, e.target.value)
                              }
                            >
                              <option value="">Select College</option>
                              {collegeOptions[branchFirstWord]?.map((college, index) => (
                                <option key={index} value={college}>
                                  {college}
                                </option>
                              ))}
                            </Form.Select>
                          </TableCell>
                          <TableCell align="center">
                            {student && student.Documents?.marksheet12th && (
                              <a
                                href={student.Documents.marksheet12th}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Marksheet
                              </a>
                            )}
                          </TableCell>
                          <TableCell align="left" style={{ display: "flex", gap: '10px', marginTop: '20px' }}>
                            <Button
                              variant="success"
                              onClick={() => handleClick(student._id)}
                            >
                              Approve
                            </Button>
                            <Button variant="danger" onClick={() => handleCancel(student._id)}>Cancel</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <TablePagination
                  rowsPerPageOptions={[25, 50, 100]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
            )
            }
          </CardContent>
          )}
          <br></br>
        </Box>
      </>
    </ThemeProvider>
  );
};

export default SearchPen;