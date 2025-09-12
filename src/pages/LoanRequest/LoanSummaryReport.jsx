import { Box } from "@mui/material";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";
import { BindStatusMaster, BindUserListByRoleId } from "../../services/Commonapi";
import { BindLoanRequest } from "../../services/LoanRequest";
import Swal from "sweetalert2";
import { StatusEnum } from "../../enums/StatusEnum";

export default function LoanSummaryReport() {
    const [userList, setUserListValue] = useState([]);
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
    const [LoanSummaryList, setLoanSummaryList] = useState([]);

    const {
        register,
        handleSubmit
    } = useForm({
        defaultValues: {
            startDate: getToday(new Date()),
            endDate: getToday(new Date())
        }
    });

    useEffect(() => {
        BindUserList();
        BindStatusDropdown();
        GetLoanSummary(
            {
                userId: 0,
                roleId: 0,
                parentUserId: 101,
                startDate: getToday(new Date()),
                endDate: getToday(new Date()),
                pageNo: 0,
                pageSize: 100,
                status: 0,
                search: ""
            }
        );
    }, []);
    const BindUserList = async () => {
        try {
            const _result = await BindUserListByRoleId(
                {
                    roleId: 0
                }
            );
            setUserListValue(_result);
        } catch (err) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: err.message || "An unexpected error occurred",
                confirmButtonText: "Ok"
            });
        }
        finally {

        }
    }


    const BindStatusDropdown = async () => {
        try {
            const _result = await BindStatusMaster({});
            setStatusMasterDrowdown(_result);
        } catch (err) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: err.message || "An unexpected error occurred",
                confirmButtonText: "Ok"
            });
        } finally {

        }
    }

    const GetLoanSummary = async (data) => {
        try {
            const _result = await BindLoanRequest(
                {
                    userId: data.userId,
                    roleId: 0,
                    parentUserId: 101,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    pageNo: 0,
                    pageSize: 100,
                    status: data.status,
                    search: data.search
                }
            );
            setLoanSummaryList(_result);

        } catch (err) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: err.message || "An unexpected error occurred",
                confirmButtonText: "Ok"
            });
        } finally {

        }
    }

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Loan Summary Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(GetLoanSummary)}>
                    <div className="col-md-6">
                        <label>From Date</label>
                        <input type="date" className="form-control" {...register("startDate")} max={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="col-md-6">
                        <label>To Date</label>
                        <input type="date" className="form-control" {...register("endDate")} max={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="col-md-6">
                        <label>Search</label>
                        <input type="text" className="form-control" {...register("search")} name="search" />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className="form-control" {...register("userId")}>
                            <option value={0} key={0}>Select User</option>
                            {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                                userList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                                    <option value={item.UserId}>{item.NameWithCompanyName}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label>Select Status</label>
                        <select className="form-control" {...register("status")}>
                            <option value={0}>Select Status</option>
                            {statusMasterdropdown && Array.isArray(statusMasterdropdown.data) && statusMasterdropdown.data.length > 0 ?
                                statusMasterdropdown.data.map((item) => (
                                    <option value={item.Id}>{item.Name}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-success me-2">Search</button>
                        <button className="btn btn-secondary me-2" >Cancel</button>
                    </div>
                </form>
            </div>
            <div className="container mt-4">
                <table className="table table-striped table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Mobile No</th>
                            <th>Company Name</th>
                            <th>Amount</th>
                            <th>Comments</th>
                            <th>Admin Comments</th>
                            <th>System Txn Id</th>
                            <th>Status</th>
                            <th>Request Date & Time</th>
                            <th>Update Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LoanSummaryList && Array.isArray(LoanSummaryList.data) && LoanSummaryList.data.length > 0 ?
                            LoanSummaryList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.CompanyName}</td>                                                                        
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.Comments}</td>
                                    <td>{item.AdminComments}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{{
                                        pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                        success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                        failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                    }[item.Status?.toString().trim().toLowerCase()] || (
                                            <img src="./StatusSvgIcon/Rtpending.svg" alt="Success" />
                                        )}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{item.ModifiedDate}</td>
                                </tr>
                            )) : (<tr>
                                <td colSpan="11" className="text-center text-muted">
                                    No records found
                                </td>
                            </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </Box>
    )
}