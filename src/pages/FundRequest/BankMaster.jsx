import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { BindUserBankList, SaveUpdateBankMaster, DeleteBankDetails } from '../../services/Bankmaster';
import '../../css/table.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
import Swal from "sweetalert2";
import { BindUserListByRoleId, BindUserRole } from "../../services/Commonapi";

const validationSchema = Yup.object().shape({
    role: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid role").required("Role is required"),
    user: Yup.number().typeError("Role is required").moreThan(0, "Please select a valid user").required("User is required"),
    bankName: Yup.string().required("Bank Name is required"),
    accountHolder: Yup.string().required("Account holder is required"),
    accountNo: Yup.string().required("Account No is required"),
    ifsc: Yup.string().required("IFSC code is required"),
    upi: Yup.string().required("UPI is required")
});

export default function BankMaster() {
    const [roleselectedValue, setRoleSelectedValue] = useState(0);
    const [userRoleList, setuserRoleListValue] = useState([]);
    const [userList, setuserListValue] = useState([]);
    const [userListSelectedValue, setuserListSelectedValue] = useState(0);
    const [userBankList, setuserBankList] = useState([]);
    const [editingId, setEditingId] = useState(0);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema)
    });

    useEffect(() => {
        BindDrowndownUserRole();
        BindUserBanktableList(0);
    }, []);


    const BindDrowndownUserRole = async () => {
        try {
            const data = await BindUserRole();
            setuserRoleListValue(data);
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

    const BindDrowndownUserList = async (roleId) => {
        try {
            const userdataList = await BindUserListByRoleId(
                {
                    roleId: roleId
                }
            );
            setuserListValue(userdataList);
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

    const BindUserBanktableList = async (Id) => {
        try {
            const userbanklist = await BindUserBankList(
                {
                    id: Id
                }
            );
            setuserBankList(userbanklist);
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

    const handleChangeRoleId = (e) => {
        const roleId = parseInt(e.target.value, 0);
        setRoleSelectedValue(roleId);
        BindDrowndownUserList(roleId);
    }

    const handleChangeUserId = (e) => {
        const UserId = parseInt(e.target.value, 0);
        setuserListSelectedValue(UserId);
    }
    const handleEdit = (row) => {
        console.log(row);
        setEditingId(row.id);
        setuserListSelectedValue(row.UserId);
        setRoleSelectedValue(row.RoleId);
        BindDrowndownUserList(row.RoleId);
        reset({
            role: row.RoleId || 0,
            user: row.UserId || 0,
            bankName: row.BankName || "",
            accountHolder: row.AccountHolderName || "",
            accountNo: row.AccountNo || "",
            ifsc: row.IfscCode || "",
            upi: row.UpiId || ""
        });
    };

    const onSubmit = (data) => {
        SaveBankMaster(data, editingId);
        reset({
            role: 0,
            user: 0,
            bankName: "",
            accountHolder: "",
            accountNo: "",
            ifsc: "",
            upi: ""
        });
        BindUserBanktableList();
    }

    const SaveBankMaster = async (data, Id = 0) => {
        try {
            const _result = await SaveUpdateBankMaster(
                {
                    id: Id,
                    userId: data.user,
                    accountHolderName: data.accountHolder,
                    bankName: data.bankName,
                    accountNo: data.accountNo,
                    ifscCode: data.ifsc,
                    accountType: "",
                    upiId: data.upi
                }
            );

            if (_result.statuscode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Bank details saved successfully",
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

    const DeleteBankMasterDetails = async (Id = 0) => {
        try {
            const _result = await DeleteBankDetails(
                {
                    Id: Id
                }
            );
            if (_result.statuscode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Bank details deleted successfully",
                    confirmButtonText: "Ok"
                });
                BindUserBanktableList();
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
                <h2 className="mb-4">Bank Master</h2>
                <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="col-md-6">
                        <label className="form-label">Select Role</label>
                        <select className={`form-control ${errors.role ? "is-invalid" : ""}`} {...register("role")} onChange={handleChangeRoleId} value={roleselectedValue}>
                            <option value={0} key={0}>Select Role</option>
                            {userRoleList && Array.isArray(userRoleList.data) && userRoleList.data.length > 0 ?
                                userRoleList.data.filter(item => item.id !== 1 && item.id !== 2).map((item) => (
                                    <option value={item.id}>{item.roleName}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
                        {errors.role && <div className="invalid-feedback">{errors.role.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className={`form-control ${errors.user ? "is-invalid" : ""}`} {...register("user")} onChange={handleChangeUserId}>
                            <option value={0} key={0}>Select User</option>
                            {userList && Array.isArray(userList.data) && userList.data.length > 0 ?
                                userList.data.map((item) => (
                                    <option value={item.UserId}>{item.NameWithCompanyName}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
                        {errors.user && <div className="invalid-feedback">{errors.user.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label>Bank Name</label>
                        <input type="text" className={`form-control ${errors.bankName ? "is-invalid" : ""}`} name="bankname" {...register("bankName")} />
                        {errors.bankName && <div className="invalid-feedback">{errors.bankName.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label>Account Holder Name</label>
                        <input type="text" className={`form-control ${errors.accountHolder ? "is-invalid" : ""}`} name="accountholdername" {...register("accountHolder")} />
                        {errors.accountHolder && <div className="invalid-feedback">{errors.accountHolder.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label>Account Number</label>
                        <input type="text" className={`form-control ${errors.accountNo ? "is-invalid" : ""}`} name="accountno" {...register("accountNo")} />
                        {errors.accountNo && <div className="invalid-feedback">{errors.accountNo.message}</div>}

                    </div>
                    <div className="col-md-6">
                        <label>IFSC Code</label>
                        <input type="text" className={`form-control ${errors.ifsc ? "is-invalid" : ""}`} name="ifsccode" {...register("ifsc")} />
                        {errors.ifsc && <div className="invalid-feedback">{errors.ifsc.message}</div>}
                    </div>
                    <div className="col-md-6">
                        <label>UPI I'd</label>
                        <input type="text" className={`form-control ${errors.upi ? "is-invalid" : ""}`} name="upiid" {...register("upi")} />
                        {errors.upi && <div className="invalid-feedback">{errors.upi.message}</div>}
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-success me-2">Submit</button>
                        <button className="btn btn-secondary me-2">Back</button>
                    </div>
                </form>
            </div>
            <div className="container mt-4">
                <h2 className="mb-4">Bank List</h2>
                <table className="table table-striped table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>UPI I'd</th>
                            <th>Bank Name</th>
                            <th>A/c Name</th>
                            <th>Account No</th>
                            <th>IFSC</th>
                            <th>Date & Time</th>
                            <th>Edit Date & Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userBankList && Array.isArray(userBankList.data) && userBankList.data.length > 0 ?
                            userBankList.data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.Email}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.UpiId}</td>
                                    <td>{item.BankName}</td>
                                    <td>{item.AccountHolderName}</td>
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{item.ModifiedDate}</td>
                                    <td><button className="text-blue-500 hover:text-blue-700 mx-2" onClick={() => handleEdit(item)}><FaEdit /></button>
                                        <button className="text-red-500 hover:text-red-700 mx-2" onClick={() => DeleteBankMasterDetails(item.id)}><FaTrash /></button></td>
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
        </Box >
    )
}