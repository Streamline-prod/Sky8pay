import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GetDeletedLien } from "../../services/ManageLien";
import { BindUserListByRoleId } from "../../services/Commonapi";
export default function DeletedLien() {

    const [bindDeletedLienList, setBindDeletedLienList] = useState([]);
    const [userList, setUserList] = useState(0);

    useEffect(() => {
        BindDeletedLienData();
        BindUserList();
    }, []);

    const BindUserList = async () => {
        try {
            const _result = await BindUserListByRoleId({ roleId: 0 });
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


    const BindDeletedLienData = async (UserId = 0) => {
        try {
            const _result = await GetDeletedLien({
                userId: UserId,
                pageNo: 0,
                pageSize: 100
            });
            setBindDeletedLienList(_result);
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
                <h2 className="mb-4">Deleted Lien</h2>
                <form className="row g-3" >
                    <div className="col-md-6">
                        <label className="form-label">Select User</label>
                        <select className="form-control" onChange={(e) => BindDeletedLienData(e.target.value)}>
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
                        <input type="text" className="form-control" />
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
                            <th>User Comments</th>
                            <th>Created Date & Time</th>
                            <th>Deleted Comments</th>
                            <th>Deleted Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bindDeletedLienList && Array.isArray(bindDeletedLienList.data) && bindDeletedLienList.data.length > 0 ?
                            bindDeletedLienList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.Comments}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{item.DeletedComments}</td>
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