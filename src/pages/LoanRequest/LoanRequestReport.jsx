import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BindUserListByRoleId, BindMasterData } from "../../services/Commonapi";
import { StatusEnum } from "../../enums/StatusEnum";
import { BindLoanHistory, BindLoanRequest, UpdateLoanRequest } from '../../services/LoanRequest'
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
const validationError = Yup.object().shape({
    statusid: Yup.number().typeError("Status is required").moreThan(0, "Please select status").required("Status is required"),
    uplinecomment: Yup.string().required("Enter Comments")
});

export default function LoanRequestReport() {

    const [userList, setUserListValue] = useState([]);
    const [loanList, setLoanList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectloanrow, setSelectloanRow] = useState(null);
    const [userLoanHistory, setUserLoanHistory] = useState([]);
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationError)
    });

    useEffect(() => {
        BindUserList();
        BindLoanRequestReport(
            {
                userId: 0,
                roleId: 0,
                parentUserId: 101,
                startDate: null,
                endDate: null,
                pageNo: 0,
                pageSize: 100,
                status: StatusEnum.Pending,
                search: ""
            }
        )
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

    const BindLoanRequestReport = async (data) => {
        try {
            const _result = await BindLoanRequest(
                {
                    userId: data.userId,
                    roleId: 0,
                    parentUserId: 101,
                    startDate: null,
                    endDate: null,
                    pageNo: 0,
                    pageSize: 100,
                    status: StatusEnum.Pending,
                    search: data.search
                }
            );
            setLoanList(_result);
        } catch (error) {

        } finally {

        }
    }

    const BindUserLoanHistory = async (UserId = 0) => {
        const _result = await BindLoanHistory(
            {
                UserId: UserId
            }
        );
        setUserLoanHistory(_result);
        BindStatusDropdown();
        setIsOpen(true);
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

    const UpdatePendingLoan = async (data) => {
        try {
            const payload = {
                ...selectloanrow,
                statusid: data.statusid,
                uplinecomment: data.uplinecomment
            };
            const _result = await UpdateLoanRequest(
                {
                    userId: payload.UserId,
                    roleId: payload.RoleId,
                    loanId: payload.Id,
                    uplineUserId: payload.ParentUserId,
                    uplineRoleId: payload.ParentRoleId,
                    requestAmount: payload.Amount,
                    adminComments: payload.uplinecomment,
                    status: payload.statusid,
                    systemTxnId: payload.SystemUniqueId
                }
            );
            setIsOpen(false);
            if (_result.statuscode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Loan Submitted successfully",
                    confirmButtonText: "Ok"
                });
                reset({ statusid: 0, uplinecomment: "" });
                BindLoanRequestReport({
                    userId: 0,
                    roleId: 0,
                    startDate: null,
                    endDate: null,
                    pageNo: 0,
                    pageSize: 100,
                    status: StatusEnum.Pending
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: _result.message || "something went wrong",
                    confirmButtonText: "Ok"
                });
            }
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

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Pending Loan Report</h2>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className="form-control" {...register("userId")} onChange={(e) => BindLoanRequestReport({
                            userId: Number(e.target.value),
                            roleId: 0,
                            startDate: null,
                            endDate: null,
                            pageNo: 0,
                            pageSize: 100,
                            status: StatusEnum.Pending
                        })}>
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
                        <label>Search</label>
                        <input type="text" className="form-control" {...register("search")} name="search" />
                    </div>
                </form>
            </div>
            <div className="container mt-4">
                <table className="table table-striped table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Company</th>
                            <th>Amount</th>
                            <th>Comments</th>
                            <th>System Txn Id</th>
                            <th>Request Date & Time</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loanList && Array.isArray(loanList.data) && loanList.data.length > 0 ?
                            loanList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.Comments}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{{
                                        pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                        success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                        failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                    }[item.Status?.toLowerCase()] || (
                                            <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />
                                        )}</td>
                                    <td><button className="text-blue-500 hover:text-blue-700 mx-2" onClick={() => { setSelectloanRow(item); BindUserLoanHistory(item.UserId); }}><FaEdit /> </button></td>
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

            {isOpen && selectloanrow && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Payment Request</h2>
                        <form className="row g-3" onSubmit={handleSubmit(UpdatePendingLoan)}>
                            <label>Given Loan</label>
                            <input type="text" className="form-control" value={userLoanHistory.data.GIVENLOAN} readOnly />
                            <label>Pending Loan</label>
                            <input type="text" className="form-control" value={userLoanHistory.data.PENDINGLOAN} readOnly />
                            <label>Recovered Loan</label>
                            <input type="text" className="form-control" value={userLoanHistory.data.RECOVERLOAN} readOnly />
                            <label>Select Status</label>
                            <select className={`form-control ${errors.statusid ? "is-invalid" : ""}`} {...register("statusid")}>
                                <option value={0}>Select Status</option>
                                {statusMasterdropdown && Array.isArray(statusMasterdropdown.data) && statusMasterdropdown.data.length > 0 ?
                                    statusMasterdropdown.data.filter(x => x.Id !== 2).map((item) => (
                                        <option value={item.Id}>{item.Name}</option>
                                    )) : (
                                        <option>No Data Found</option>
                                    )}
                            </select>
                            {errors.statusid && <div className="invalid-feedback">{errors.statusid.message}</div>}
                            <label>Enter Comment</label>
                            <input type="text" className={`form-control ${errors.uplinecomment ? "is-invalid" : ""}`} {...register("uplinecomment")} />
                            {errors.uplinecomment && <div className="invalid-feedback">{errors.uplinecomment.message}</div>}
                            <div className="modal-footer">
                                <button className="btn btn-secondary me-2" onClick={() => {
                                    reset({ statusid: 0, uplinecomment: "" });
                                    setIsOpen(false);
                                }} >Cancel</button>
                                <button type="submit" className="btn btn-success me-2" >Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Box>
    )
}