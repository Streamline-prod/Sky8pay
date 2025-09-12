import { Box } from "@mui/material"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { BindUserListByRoleId } from "../../services/Commonapi";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { BindLoanHistory, UserLoanRecovered } from "../../services/LoanRequest";
const validationError = Yup.object().shape({
    userId: Yup.number().typeError("User is required").moreThan(0, "Please Select User").required("User is required"),
    amount: Yup.number().typeError("Amount is required").moreThan(0, "Enter a valid amount").required("Amount is required"),
    comment: Yup.string().required("Comment is required")
});

export default function LoanRecovered() {

    const [userList, setUserListValue] = useState([]);
    const [userLoandetails, setUserLoanDetails] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [dataOnSubmit, setDataOnSubmit] = useState([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationError)
    });

    useEffect(() => {
        BindUserList();
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

    const GetUserLoanDetails = async (Id = 0) => {
        try {
            const _result = await BindLoanHistory({ userId: Id });
            setUserLoanDetails(_result);
            return _result;
        } catch (err) {
            Swal.fire({
                icon: "warning",
                title: "Warning",
                text: err.message || "An unexpected error occurred",
                confirmButtonText: "Ok"
            });
        } finally {

        }
    };

    const ConfirmLoanRecoveredPopup = async (data) => {
        try {
            const _result = await GetUserLoanDetails(data.userId);
            console.log(_result);
            if (_result.data.PENDINGLOAN > 0 && _result.data.PENDINGLOAN >= data.amount) {
                setDataOnSubmit(data);
                setIsOpen(true);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "error",
                    text: "The loan amount you entered exceeds the pending loan amount. Please enter a valid amount.",
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

    const RecoveredUserLoan = async (data) => {
        try {
            const _result = await UserLoanRecovered({
                userId: data.userId,
                comment: data.comment,
                amount: data.amount,
                systemUniqueId: ""
            });
            setIsOpen(false);
            if (_result.statuscode === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: _result.message || "Loan recovered successfully",
                    confirmButtonText: "Ok"
                });
                reset({ userId: 0, amount: "",comment:"" });                
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
                <h2 className="mb-4">Loan Recovered</h2>
                <form className="row g-3" onSubmit={handleSubmit(ConfirmLoanRecoveredPopup)}>
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>&nbsp;&nbsp;{
                            userLoandetails && userLoandetails.data ? (
                                <span>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.PENDINGLOAN)}</span>
                            ) : (<span></span>)}
                        <select className={`form-control ${errors.userId ? "is-invalid" : ""}`} {...register("userId")} onChange={(e) => GetUserLoanDetails(e.target.value)}>
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
                        <button type="submit" className="btn btn-success me-2">Submit</button>
                        <button className="btn btn-secondary me-2" >Cancel</button>
                    </div>
                </form>
            </div>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Payment Request</h2>
                        <form className="row g-3" onSubmit={handleSubmit(RecoveredUserLoan)}>
                            {userLoandetails && userLoandetails.data ? (
                                <>
                                    <div className="row">
                                        <table className="table table-striped table-bordered table-hover shadow-sm">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <label>Total Given Loan</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.GIVENLOAN)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Loan Recovered</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.RECOVERLOAN)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Pending Loan</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.PENDINGLOAN)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Transaction Amount</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(dataOnSubmit.amount)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Total Loan Recovered</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(userLoandetails.data.RECOVERLOAN + dataOnSubmit.amount)}</label>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="row">
                                        <table className="table table-striped table-bordered table-hover shadow-sm">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <label>Total Given Loan</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(0)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Loan Recovered</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(0)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Pending Loan</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(0)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Transaction Amount</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(0)}</label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Total Loan Recovered</label>
                                                    </td>
                                                    <td>
                                                        <label>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(0)}</label>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            <div className="modal-footer">
                                <button className="btn btn-secondary me-2" onClick={() => {
                                    // reset({ statusid: 0, uplinecomment: "" });
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