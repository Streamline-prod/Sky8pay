import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { BindUserListByRoleId,BindStatusMaster } from "../../services/Commonapi";
import { useForm } from "react-hook-form";
import { BindFundRequest, UpdatePendingFundRequest } from "../../services/FundRequest";
import { StatusEnum } from "../../enums/StatusEnum";
import { FaEdit, FaEye } from "react-icons/fa";
import '../../css/popup.css';
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";


const validateionError = Yup.object().shape({
    statusid: Yup.number().typeError("Status is required").moreThan(0, "Please select status").required("Status is required"),
    uplinecomment: Yup.string().required("Enter comments")
});

export default function PendingFundRequest() {

    const [userList, setUserListValue] = useState([]);
    const [fundrequest, setFundrequest] = useState([]);
    //const [searchText, setSeachText] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
    const [selectfundRow, setSelectFundRow] = useState(null);


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validateionError),
        defaultValues: {
            statusId: 0,
            UplineComment: "",
        },
    });


    useEffect(() => {
        BindUserList();
        BindPendingFundRequest({
            userId: 0,
            roleId: 0,
            startDate: null,
            endDate: null,
            pageNo: 0,
            pageSize: 100,
            status: StatusEnum.Pending
        });
        BindStatusDropdown();
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

    const BindPendingFundRequest = async (data) => {

        try {
            const _result = await BindFundRequest(
                {
                    userId: data.userId,
                    roleId: 0,
                    startDate: null,
                    endDate: null,
                    pageNo: 0,
                    pageSize: 100,
                    status: StatusEnum.Pending
                }
            );
            setFundrequest(_result);
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

    const onSubmitChangeStatus = async (data) => {
        try {
            const payload =
            {
                ...selectfundRow,
                statusId: Number(data.statusid),
                UplineComments: data.uplinecomment
            };
            var _result = await UpdatePendingFundRequest(
                {
                    status: payload.statusId,
                    amount: payload.Amount,
                    userId: payload.UserId,
                    roleId: payload.RoleId,
                    fundId: payload.Id,
                    uplinecomment: payload.UplineComments,
                    systemUniqueId: payload.SystemGeneratedId,
                    uplineUserId: 101,
                    uplineRoleId: 2
                }
            );
            setIsOpen(false);
            if (_result.statuscode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Bank details deleted successfully",
                    confirmButtonText: "Ok"
                });
                reset({ statusid: 0, uplinecomment: "" });
                BindPendingFundRequest({
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
        } finally {

        }
    }

    // const filteredData = fundrequest.filter((item) =>
    //     Object.values(item).some((val) =>
    //         String(val).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

  
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Pending Fund Report</h2>
                <form className="row g-3">                    
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className="form-control" {...register("userId")} onChange={(e) => BindPendingFundRequest({
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
                        <input type="text" className="form-control" name="search" />
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
                            <th>UPI</th>
                            <th>Acc/No</th>
                            <th>Ifsc</th>
                            <th>Paymode</th>
                            <th>Utr no</th>
                            <th>Amount</th>
                            <th>Req Date</th>
                            <th>Comment</th>
                            <th>Txn Id</th> 
                            <th>Date & Time</th>                            
                            <th>Receipt</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fundrequest && Array.isArray(fundrequest.data) && fundrequest.data.length > 0 ?
                            fundrequest.data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.Upi}</td>
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>
                                    <td>{item.PaymentMode}</td>
                                    <td>{item.PaymentRequestUTR}</td>                                    
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.PaymentDate}</td>
                                    <td>{item.Customercomment}</td>
                                     <td>{item.SystemGeneratedId}</td> 
                                    <td>{item.CreatedDate}</td>
                                    {/* <td>{item.ModifiedDate}</td> */}
                                    <td>{item.PaymentRecipiet ? (
                                        <a href={item.PaymentRecipiet} target="_blank" className="text-blue-500 hover:text-blue-700 mx-2"><FaEye /></a>
                                    ) : (
                                        "No Receipt"
                                    )}
                                    </td>
                                    <td><button className="text-blue-500 hover:text-blue-700 mx-2" onClick={() => { setSelectFundRow(item); setIsOpen(true); }}><FaEdit /> </button></td>
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

            {isOpen && selectfundRow && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Payment Request</h2>
                        <form className="row g-3" onSubmit={handleSubmit(onSubmitChangeStatus)}>
                            <label>Select Status</label>
                            <select className={`form-control ${errors.statusid ? "is-invalid" : ""}`} {...register("statusid")} >
                                <option value={0}>Select Status</option>
                                {statusMasterdropdown && Array.isArray(statusMasterdropdown.data) && statusMasterdropdown.data.length > 0 ?
                                    statusMasterdropdown.data.filter(x => x.Id !== 2).map((item) => (
                                        <option value={item.Id}>{item.Name}</option>
                                    )) : (
                                        <option>No Data Found</option>
                                    )}
                            </select>
                            {errors.statusid && <div className="invalid-feedback">{errors.statusid.message}</div>}
                            <label>Enter Comments</label>
                            <input type="text" className={`form-control ${errors.uplinecomment ? "is-invalid" : ""}`} placeholder="Enter Comments" {...register("uplinecomment")} />
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