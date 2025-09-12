import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";
import { BindStatusMaster, BindUserListByRoleId, BindAPIListByServiceName } from "../../services/Commonapi";
import { GetPayoutReports } from "../../services/PayoutReport";
import { FaExclamationTriangle, FaEye, FaFileInvoice, FaReceipt } from "react-icons/fa";

export default function PayoutReport() {
    const [userList, setUserListValue] = useState(0);
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState(0);
    const [PayoutReportList, setPayoutReportList] = useState([]);

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
        BindStatusDropdown();
        BindAPIListServiceName();
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

    const BindPayoutReport = async (data) => {
        try {
            //console.log(data);
            const _result = await GetPayoutReports({
                userId: data.userId,
                startDate: data.startDate,
                endDate: data.endDate,
                apiId: data.apiId,
                status: data.statusId,
                search: data.search,
                pageNo: 0,
                pageSize: 100,
                txnFrom: 0,
                mode: 0
            });            
            setPayoutReportList(_result);
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

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Payout Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindPayoutReport)} >
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
                                    <option value={item.Id}>{item.ApiName}</option>
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
                        <label>Select Status</label>
                        <select className="form-control" {...register("StatusId")}>
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
                            <th>Mode</th>
                            <th>Status</th>
                            <th>RRN</th>
                            <th>Amount</th>
                            <th>Name</th>
                            <th>Account No</th>
                            <th>IFSC</th>
                            <th>UPI</th>
                            <th>Open</th>
                            <th>Surcharge</th>
                            <th>GST</th>
                            <th>Payable</th>
                            <th>Closed</th>
                            <th>Ref Id</th>
                            <th>Unique Id</th>
                            <th>API Ref Id</th>
                            <th>Reciept</th>
                            <th>Complaint</th>
                            <th>Mode</th>
                            <th>CallBack Time</th>
                            <th>CheckStatus Time</th>
                            {/* <th>Action</th> */}
                            <th>IP Address</th>
                            <th>Invoice</th>
                            {/* <th>CheckStatus</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {PayoutReportList && Array.isArray(PayoutReportList.data) && PayoutReportList.data.length > 0 ?
                            PayoutReportList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.UserName}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.ApiName}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{item.PaymentMode}</td>
                                    <td>{item.STATUS}</td>
                                    <td>{item.BankPayoutId}</td>                                    
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.TransactionAmount)}</td>
                                    <td>{item.AccountHolderName}</td>
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>
                                    <td>{item.UpiId}</td>
                                    <td>{item.OpenBalance}</td>
                                    <td>{item.Surcharge}</td>
                                    <td>{item.Gst}</td>
                                    <td>{item.PayableAmount}</td>
                                    <td>{item.ClosedBalance}</td>
                                    <td>{item.ReferenceId}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{item.ApiUniqueId}</td>
                                    <td>
                                        <button><FaReceipt/></button>
                                    </td>
                                    <td>
                                        <button><FaExclamationTriangle /></button>
                                    </td>
                                    <td>{item.TransactionFrom}</td>
                                    <td>{item.CallBackDateTime}</td>
                                    <td>{item.CheckStatusDateTime}</td>
                                    {/* <td></td> */}
                                    <td>{item.IpAddress}</td>
                                   <td>
                                        <button><FaFileInvoice/></button>
                                    </td>
                                    {/* <td>
                                        <button><FaEye/></button>
                                    </td> */}
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