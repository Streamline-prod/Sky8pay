import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { UserLifeTimeLoanReport } from "../../services/LoanRequest";
import { BindUserListByRoleId } from "../../services/Commonapi";

export default function LifeTimeLoanReport() {

    const [LifeTimeLoanList, setLifeTimeLoanList] = useState([]);
    const [userList, setUserListValue] = useState([]);

    useEffect(() => {
        BindLifetimeReport(0);
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

    const BindLifetimeReport = async (UserId = 0) => {
        try {
            const _result = await UserLifeTimeLoanReport({
                userId: UserId
            });
            setLifeTimeLoanList(_result);
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
                <h2 className="mb-4">LifeTime Loan Report</h2>
                <form className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className="form-control" onChange={(e) => BindLifetimeReport(e.target.value)}>
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
                            <th>Role</th>
                            <th>Mobile No</th>
                            <th>Company Name</th>
                            <th>Total Given Loan</th>
                            <th>Total Recovered Loan</th>
                            <th>Due Loan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LifeTimeLoanList && Array.isArray(LifeTimeLoanList.data) && LifeTimeLoanList.data.length > 0 ?
                            LifeTimeLoanList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.RoleName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.TotalGivenLoan)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.TotalRecoveredLoan)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.DueLoan)}</td>                                    
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