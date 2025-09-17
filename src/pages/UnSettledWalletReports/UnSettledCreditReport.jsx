import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";
import { BindUserListByRoleId } from "../../services/Commonapi";
import Swal from "sweetalert2";
import { GetUnsettledWallet } from "../../services/UnsettledWallet";

export default function UnSettledCreditReport() {
    const [userList, setUserListValue] = useState(0);
    const [UnsettledCreditReportList, setUnsettledCreditReportList] = useState([]);



    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        defaultValues: {
            startDate: getToday(new Date()),
            endDate: getToday(new Date()),
        }
    });

    useEffect(() => {
        BindUserList();
        BindUnsettledCreditReport({
            userId: 0,
            parentId: 0,
            startDate: getToday(new Date()),
            endDate: getToday(new Date()),
            status: 0,
            search: "",
            pageNo: 0,
            pageSize: 100,
            transactionTypeId: 0,
            reportType: 1
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

    const BindUnsettledCreditReport = async (data) => {
        try {
            const _result = await GetUnsettledWallet({
                userId: data.userId,
                parentId: 0,
                startDate: data.startDate,
                endDate: data.endDate,
                status: 0,
                search: data.search,
                pageNo: 0,
                pageSize: 100,
                transactionTypeId: 0,
                reportType: 1
            });
            setUnsettledCreditReportList(_result);
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
                <h2 className="mb-4">Unsettled Credit Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindUnsettledCreditReport)} >
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
                        <input type="text" className="form-control" {...register("search")} />
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
                        <button type="submit" className="btn btn-success me-2">Search</button>
                        <button type="button" className="btn btn-secondary me-2">Back</button>
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
                            <th>Mobile No</th>
                            <th>Service Name</th>
                            <th>Date & Time</th>
                            <th>Open</th>
                            <th>Payable Amount</th>
                            <th>Amount</th>
                            <th>Commission</th>
                            <th>TDS</th>
                            <th>Surcharge</th>
                            <th>GST</th>
                            <th>Closed</th>
                            <th>Unique Id</th>
                            <th>Comment</th>

                        </tr>
                    </thead>
                    <tbody>
                        {UnsettledCreditReportList && Array.isArray(UnsettledCreditReportList.data) && UnsettledCreditReportList.data.length > 0 ?
                            UnsettledCreditReportList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.UserName}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td style={{ color: item.ServiceName.toLowerCase() == "debit" ? "red" : "green" }}>{item.ServiceName}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.OpenBalance)}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.PayableAmount)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Commission)}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Tds)}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Surcharge)}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Gst)}</td>
                                    <td> {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.ClosedBal)}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{item.Comment}</td>
                                </tr>
                            )) : (<tr>
                                <td colSpan="29" className="text-center text-muted">
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