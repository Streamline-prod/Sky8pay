import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";
import { BindUserListByRoleId, BindAPIListByServiceName } from "../../services/Commonapi";
import { GetPayoutInvoiceLink, GetPayoutReports } from "../../services/PayoutReport";
import {  FaFileInvoice, FaReceipt } from "react-icons/fa";
import Swal from "sweetalert2";

export default function PayoutReport() {
    const [userList, setUserListValue] = useState(0);
    //const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState(0);
    const [PayoutReportList, setPayoutReportList] = useState([]);
    const [IsRecieptOpen, setIsRecieptOpen] = useState(false);
    const [IsCallBackOpen, setIsCallBackOpen] = useState(false);
    const [IsCheckStatusOpen, setIsCheckStatusOpen] = useState(false);
    const [payoutTrData, setPayoutTrData] = useState(null);



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
        //BindStatusDropdown();
        BindAPIListServiceName();
        BindPayoutReport({
            userId: 0,
            startDate: getToday(new Date()),
            endDate: getToday(new Date()),
            apiId: 0,
            status: 1,
            search: "",
            pageNo: 0,
            pageSize: 100,
            txnFrom: 0,
            mode: 0
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

    const BindPayoutReport = async (data) => {
        try {                       
            const _result = await GetPayoutReports({
                userId: data.userId,
                startDate: data.startDate,
                endDate: data.endDate,
                apiId: data.apiId,
                status: 1,
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

    const DownloadPayoutInvoice = async (data) => {
        try {
            const _result = await GetPayoutInvoiceLink({
                SystemUniqueId: data.SystemUniqueId
            });
            const link = document.createElement("a");
            link.href = _result.data;
            link.target = "_blank";
            link.download = _result.data;
            link.click();
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
                            <th>IP Address</th>
                            <th>Invoice</th>
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
                                    <td>
                                        {{
                                            //pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                            success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                            //failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                        }[item.STATUS?.toLowerCase()] || (
                                                <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />
                                            )}
                                    </td>
                                    <td>{item.BankPayoutId}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.TransactionAmount)}</td>
                                    <td>{item.AccountHolderName}</td>
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>
                                    <td>{item.UpiId}</td>                                    
                                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.OpenBalance)}                                    
                                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Surcharge)}                                    
                                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Gst)}                                    
                                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.PayableAmount)}                                    
                                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.ClosedBalance)}
                                    <td>{item.ReferenceId}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{item.ApiUniqueId}</td>
                                    <td>
                                        <button onClick={() => { setPayoutTrData(item); setIsRecieptOpen(true) }}><FaReceipt /></button>
                                    </td>
                                    <td>
                                        {{
                                            yes: <img src="./icons/Rtraise.svg" alt="" />,
                                            no: <img src="./icons/Rtraise.svg" alt="" />
                                        }[item.RasieComplaint?.toLowerCase()] || (
                                                <img src="./icons/Rtticket.svg" />
                                            )}
                                    </td>
                                    <td>{item.TransactionFrom}</td>
                                    <td><button onClick={() => { setPayoutTrData(item); setIsCallBackOpen(true) }}><FaReceipt /></button></td>
                                    <td><button onClick={() => { setPayoutTrData(item); setIsCheckStatusOpen(true) }}><FaReceipt /></button></td>
                                    <td>{item.IpAddress}</td>
                                    <td>
                                        <button onClick={() => DownloadPayoutInvoice(item)}><FaFileInvoice /></button>
                                    </td>
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

            {/* Reciept Popup start  */}

            {IsRecieptOpen && payoutTrData && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>Reciept</h2>
                        <table>
                            <tbody>
                                <tr>                                    
                                    <td>Status</td>
                                    <td>{payoutTrData.STATUS}</td>
                                </tr>
                                <tr>
                                    <td>Payment Date</td>
                                    <td>{payoutTrData.CreatedDate}</td>
                                </tr>
                                <tr>
                                    <td>Amount</td>
                                    <td>{payoutTrData.TransactionAmount}</td>
                                </tr>
                                <tr>
                                    <td>UTR No</td>
                                    <td>{payoutTrData.BankPayoutId}</td>
                                </tr>
                                <tr>
                                    <td>Name</td>
                                    <td>{payoutTrData.AccountHolderName}</td>
                                </tr>
                                <tr>
                                    <td>Account No</td>
                                    <td>{payoutTrData.AccountNo}</td>
                                </tr>
                                <tr>
                                    <td>IFSC</td>
                                    <td>{payoutTrData.IfscCode}</td>
                                </tr>
                                <tr>
                                    <td>Invoice No</td>
                                    <td>{payoutTrData.SystemUniqueId}</td>
                                </tr>
                                <tr>
                                    <td>Reference Id</td>
                                    <td>{payoutTrData.ReferenceId}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="col-md-6">
                            <button type="button" onClick={() => setIsRecieptOpen(false)} className="btn btn-secondary me-2">Back</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reciept Popup end */}


            {/* CallBack Popup start  */}

            {IsCallBackOpen && payoutTrData && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>CallBack Details</h2>
                        <div className="col-md-12">
                            <label>CallBack Date & Time</label>
                            <label>{payoutTrData.CallBackDateTime}</label>
                            <label>CallBack Response</label>
                            <label style={{ lineBreak: "anywhere" }}>{payoutTrData.CallBackResponse}</label>
                        </div>
                        <div className="col-md-6">
                            <button type="button" onClick={() => setIsCallBackOpen(false)} className="btn btn-secondary me-2">Back</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CallBack Popup end */}

            {/* CallCheckStatus Popup start  */}

            {IsCheckStatusOpen && payoutTrData && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h2>CallBack Details</h2>
                        <div className="col-md-12">
                            <label>CallBack Date & Time</label>
                            <label>{payoutTrData.CheckStatusDateTime}</label>
                            <label>CallBack Response</label>
                            <label style={{ lineBreak: "anywhere" }}>{payoutTrData.CheckStatusResponse}</label>
                        </div>
                        <div className="col-md-6">
                            <button type="button" onClick={() => setIsCheckStatusOpen(false)} className="btn btn-secondary me-2">Back</button>
                        </div>
                    </div>
                </div>
            )}

            {/* CallCheckStatus Popup end */}

        </Box>
    )
}