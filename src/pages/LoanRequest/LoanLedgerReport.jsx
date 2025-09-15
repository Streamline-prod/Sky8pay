import { Box } from "@mui/material";
import { BindUserListByRoleId, BindMasterData } from "../../services/Commonapi";
import { useEffect, useState } from "react";
import { GetLoanLedger } from "../../services/LoanLedger";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";

export default function LoanLedgerReport() {

    const [userList, setUserListValue] = useState([]);
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
    const [LoanLedgerList, setLoanLedgerList] = useState([]);


    const {
        register,
        handleSubmit,
    } = useForm({
        defaultValues: {
            startDate: getToday(new Date()),
            endDate: getToday(new Date())
        }
    });

    useEffect(() => {
        BindUserList();
        BindStatusDropdown();
        BindLoanLedgerList({
                    userId: 0,
                    startDate: getToday(new Date()),
                    endDate: getToday(new Date()),
                    status: 0,
                    pageNo: 0,
                    pageSize: 100
                });
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
            const _result = await BindMasterData({
                type:"status"
            });
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

    const BindLoanLedgerList = async (data) => {        
        try {
            const _result = await GetLoanLedger(
                {
                    userId: data.userId,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    status: data.status,
                    pageNo: 0,
                    pageSize: 100
                }
            );
            setLoanLedgerList(_result);
        } catch (err) {

        } finally {

        }
    }


    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Loan Ledger Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindLoanLedgerList)}>
                    <div className="col-md-6">
                        <label>From Date</label>
                        <input type="date" className="form-control" {...register("startDate")}  max={new Date().toISOString().split("T")[0]}/>
                    </div>
                    <div className="col-md-6">
                        <label>To Date</label>
                        <input type="date" className="form-control" {...register("endDate")} max={new Date().toISOString().split("T")[0]}/>
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
                        <button type="submit" className="btn btn-success me-2">Save</button>
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
                            <th>Open</th>
                            <th>Amount</th>
                            <th>Closed</th>
                            <th>Type</th>
                            <th>System Txn Id</th>
                            <th>Status</th>
                            <th>Request Date & Time</th>
                            <th>Comments</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LoanLedgerList && Array.isArray(LoanLedgerList.data) && LoanLedgerList.data.length > 0 ?
                            LoanLedgerList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.UserName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.OpenBalance)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.ClosedBal)}</td>
                                    <td>{item.TransactionType}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{{
                                        pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                        success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                        failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                    }[item.StatusName?.toLowerCase()] || (
                                            <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />
                                        )}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{item.Comment}</td>
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