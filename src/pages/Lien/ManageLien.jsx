import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { BindUserListByRoleId, BindUserRole } from "../../services/Commonapi";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { DeleteUserLien, GetLienData, SubmitLienData } from "../../services/ManageLien";
import { FaTrash } from "react-icons/fa";

const validationError = Yup.object().shape({
    roleId: Yup.number().typeError("Role is required").moreThan(0, "Please Select Role").required("Role is required"),
    userId: Yup.number().typeError("User is required").moreThan(0, "Please Select User").required("User is required"),
    amount: Yup.number().typeError("Amount is required").moreThan(0, "Please Enter Valid Amount").required("Amount is required"),
    comment: Yup.string().required("Comment is required")
});
const validationPopupError = Yup.object().shape({
    uplinecomment: Yup.string().required("Comment is required")
});

export default function ManageLien() {

    const [userRoleList, setUserRoleList] = useState(0);
    const [userList, setUserList] = useState(0);
    const [LienDataList, setLienDataList] = useState([]);
    const [LienId, setLienId] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationError)
    });


    const {
        register: registerPopup,
        handleSubmit: handlePopupSubmit,
        reset: resetPopup,
        formState: { errors: Popuperrors }
    } = useForm({
        resolver: yupResolver(validationPopupError)
    });

    useEffect(() => {
        BindUserRoleMaster();
        BindLienData(0);
    }, []);


    const BindUserRoleMaster = async () => {
        try {
            const _result = await BindUserRole();
            setUserRoleList(_result);
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

    const BindUserList = async (RoleId = 0) => {
        try {
            const _result = await BindUserListByRoleId({ roleId: RoleId });
            setUserList(_result);

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

    const LienDataSubmit = async (data) => {
        try {
            const _result = await SubmitLienData(
                {
                    userId: data.userId,
                    capAmount: data.amount,
                    remarks: data.comment,
                    deleteRemarks: ""
                }
            );
            if (_result.statuscode === 200) {
                BindLienData(0);
                reset({ roleId: 0, userId: 0, amount: "", comment: "" });
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Lien data submitted",
                    confirmButtonText: "Ok"
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


    const BindLienData = async (userId = 0) => {
        try {
            const _result = await GetLienData(
                {
                    userId: userId,
                    pageNo: 0,
                    pageSize: 100
                }
            );            
            setLienDataList(_result);
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

    const Deletelien = async (data) => {
        try {
            const _result = await DeleteUserLien({
                lienId: LienId,
                uplineComment: data.uplinecomment
            });
            setIsOpen(false);
            resetPopup({ uplinecomment: "" });
            if (_result.statuscode === 200) {
                BindLienData(0);
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Lien data submitted",
                    confirmButtonText: "Ok"
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

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Manage Lien</h2>
                <form className="row g-3" onSubmit={handleSubmit(LienDataSubmit)}>
                    <div className="col-md-6">
                        <label className="form-label">Select Role</label>
                        <select className={`form-control ${errors.roleId ? "is-invalid" : ""}`} {...register("roleId")} onChange={(e) => BindUserList(Number(e.target.value))}>
                            <option value={0} key={0}>Select Role</option>
                            {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                                userRoleList.data.filter(x => x.id !== 1 && x.id !== 2 && x.id !== 7).map((item) => (
                                    <option value={item.id}>{item.roleName}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
                        {errors.roleId && <div className="invalid-feedback">{errors.roleId.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className={`form-control ${errors.userId ? "is-invalid" : ""}`} {...register("userId")}>
                            <option value={0} key={0}>Select User</option>
                            {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                                userList.data.filter(x => x.UserId !== 100 && x.UserId !== 101).map((item) => (
                                    <option value={item.UserId}>{item.NameWithCompanyName}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
                        {errors.userId && <div className="invalid-feedback">{errors.userId.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label>Enter Amount</label>
                        <input type="text" className={`form-control ${errors.amount ? "is-invalid" : ""}`} {...register("amount")} />
                        {errors.amount && <div className="invalid-feedback">{errors.amount.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label>Enter Comment</label>
                        <input type="text" className={`form-control ${errors.comment ? "is-invalid" : ""}`} {...register("comment")} />
                        {errors.comment && <div className="invalid-feedback">{errors.comment.message}</div>}

                    </div>
                    <div className="col-md-6">
                        <button className="btn btn-secondary me-2" onClick={() => {
                            // reset({ statusid: 0, uplinecomment: "" });                            
                        }} >Cancel</button>
                        <button type="submit" className="btn btn-success me-2" >Submit</button>
                    </div>
                </form>
            </div>
            <div className="container mt-4">
                <table className="table table-striped table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Company Name</th>
                            <th>Amount</th>
                            <th>Comments</th>
                            <th>Date & Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LienDataList && Array.isArray(LienDataList.data) && LienDataList.data.length > 0 ?
                            LienDataList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.Comments}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td><button className="text-blue-500 hover:text-blue-700 mx-2" onClick={() => { setLienId(item.LienId); setIsOpen(true); }}><FaTrash /> </button></td>
                                </tr>
                            )) : (<tr>
                                <td colSpan="11" className="text-center text-muted">
                                    No records found
                                </td>
                            </tr>
                            )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3}>Total</td>
                            <td colSpan={2}>
                                {LienDataList && Array.isArray(LienDataList.data) && LienDataList.data.length > 0
                                    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
                                        LienDataList.data.reduce((sum, item) => sum + (item.Amount || 0), 0)
                                    )
                                    : 0}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>


            {isOpen && setLienId && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Payment Request</h2>
                        <form className="row g-3" onSubmit={handlePopupSubmit(Deletelien)}>
                            <label>Enter Comments</label>
                            <input type="text" className={`form-control ${Popuperrors.uplinecomment ? "is-invalid" : ""}`} placeholder="Enter Comments" {...registerPopup("uplinecomment")} />
                            {Popuperrors.uplinecomment && <div className="invalid-feedback">{Popuperrors.uplinecomment.message}</div>}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary me-2" onClick={() => {
                                    resetPopup({ uplinecomment: "" });
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