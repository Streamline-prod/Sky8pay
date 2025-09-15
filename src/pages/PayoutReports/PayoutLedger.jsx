import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";
import { BindUserListByRoleId, BindAPIListByServiceName, BindMasterData } from "../../services/Commonapi";
import { GetPayoutLedger } from "../../services/PayoutReport";
import Swal from "sweetalert2";

export default function PayoutLedger() {
    const [userList, setUserListValue] = useState(0);    
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState(0);
    const [PayoutLedgerList, setPayoutLedgerList] = useState([]);    
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);



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
        BindPayoutLedger({
            userId: 0,
            startDate: getToday(new Date()),
            endDate: getToday(new Date()),
            apiId: 0,
            status: 3,
            search: "",
            pageNo: 0,
            pageSize: 100,
            txnFrom: 0,
            mode: 0
        });
        BindUserList();        
        BindAPIListServiceName();
        BindStatusDropdown();
    }, []);
    
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

    const BindPayoutLedger = async (data) => {
        try {
            const _result = await GetPayoutLedger({
                userId: data.userId,
                transactionTypeId: data.transactionTypeId,
                startDate: data.startDate,
                endDate: data.endDate,
                apiId: data.apiId,
                status: data.statusId,
                search: data.search,
                pageNo: 0,
                pageSize: 100
            });
            setPayoutLedgerList(_result);
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

    const BindAPIListServiceName = async () => {
        try {
            const _result = await BindAPIListByServiceName({
                serviceName: "Payout"
            });
            setApiMasterByServiceName(_result);
        }
        catch (err) {
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
                <h2 className="mb-4">Payout Ledger Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindPayoutLedger)} >
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
                        <label>Select API</label>
                        <select className="form-control" {...register("apiId")}>
                            <option value={0}>Select API</option>
                            {ApiMasterByServiceName && Array.isArray(ApiMasterByServiceName.data) && ApiMasterByServiceName.data.length > 0 ?
                                ApiMasterByServiceName.data.map((item) => (
                                    <option value={item.ApiId}>{item.ApiName}</option>
                                )) : (
                                    <option>No Data Found</option>
                                )
                            }
                        </select>
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
                        <label className="form-label">Select Status</label>
                        <select className="form-control" {...register("statusId")}>
                            <option value={0} key={0}>Select Status</option>
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
                            <th>Service</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>RRN</th>
                            <th>Type</th>
                            <th>Open</th>
                            <th>Commission</th>
                            <th>TDS</th>
                            <th>Surcharge</th>
                            <th>GST</th>
                            <th>Payable</th>
                            <th>Closed</th>
                            <th>Unique Id</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {PayoutLedgerList && Array.isArray(PayoutLedgerList.data) && PayoutLedgerList.data.length > 0 ?
                            PayoutLedgerList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.ApiName}</td>
                                    <td>{item.CreatedDate}</td>
                                    {/* <td>{item.PaymentMode}</td> */}
                                    <td>
                                        {{
                                            pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                            success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                            failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                        }[item.STATUS?.toLowerCase()] || (
                                                <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                            )}
                                    </td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.BankUTRNo}</td>
                                    <td
                                        style={{
                                            color:
                                                item.TransactionType?.toLowerCase() === "credit" ? "green" : "red"
                                        }}>{item.TransactionType}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.OpenBalance)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Commission)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Tds)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Surcharge)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Gst)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.PayableAmount)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.ClosedBal)}</td>
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