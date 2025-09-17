import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BindUserListByRoleId, BindAPIListByServiceName } from "../../services/Commonapi";
import { FaFileInvoice, FaReceipt } from "react-icons/fa";
import Swal from "sweetalert2";
import { GetPayinInvoiceLink } from "../../services/PayinReport";
import { GetsettledPayinReport } from "../../services/SettledPayin";
import { getToday } from "../../utils/CurrentDate";

export default function SettledPayinReport() {
    const [userList, setUserListValue] = useState(0);
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState(0);
    const [PayinReportList, setPayinReportList] = useState([]);
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
        BindSettledPayinReport({
            userId: 0,
            startDate: null,
            endDate: null,
            apiId: 0,
            status: 1,
            search: "",
            transactionTypeId:0,
            pageNo: 0,
            pageSize: 100            
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

    const BindSettledPayinReport = async (data) => {
        try {
            const _result = await GetsettledPayinReport({
                userId: data.userId,
                startDate: data.startDate? data.startDate: null,
                endDate: data.endDate? data.endDate: null,
                apiId: data.apiId,
                status: 1,
                search: data.search,
                transactionTypeId:0,
                pageNo: 0,
                pageSize: 100
            });            
            setPayinReportList(_result);
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
                serviceName: "Payin"
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

    const DownloadPayinInvoice = async (data) => {
        try {
            const _result = await GetPayinInvoiceLink({
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
                <h2 className="mb-4">Settled Payin Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindSettledPayinReport)} >
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
                            <th>Status</th>
                            <th>Amount</th>
                            <th>RRN</th>
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
                            <th>Reciept</th>
                            <th>Complaint</th>
                            <th>CharBacks</th>
                            <th>Mode</th>
                            <th>CallBack Time</th>
                            <th>CheckStatus Time</th>
                            <th>Fraud</th>
                            <th>IP Address</th>
                            <th>Invoice</th>
                            <th>IP State</th>
                            <th>IP City</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {PayinReportList && Array.isArray(PayinReportList.data) && PayinReportList.data.length > 0 ?
                            PayinReportList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.UserName}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.ApiName}</td>
                                    <td>{item.CreatedDate}</td>                                    
                                    <td>
                                        {{
                                            pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                            success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                            failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                        }[item.STATUS?.toLowerCase()] || (
                                                <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />
                                            )}
                                    </td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.TransactionAmount)}</td>
                                    <td>{item.BankPayoutId}</td>
                                    <td>{item.AccountHolderName}</td>
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>                                    
                                    <td>{item.UpiId}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.OpenBalance)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Surcharge)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Gst)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.PayableAmount)}</td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.ClosedBalance)}</td>
                                    <td>{item.ReferenceId}</td>
                                    <td>{item.SystemUniqueId}</td>                                    
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
                                    <td>{item.RasieChargeBack}</td>
                                    <td>{item.TransactionFrom}</td>
                                    <td><button onClick={() => { setPayoutTrData(item); setIsCallBackOpen(true) }}><FaReceipt /></button></td>
                                    <td><button onClick={() => { setPayoutTrData(item); setIsCheckStatusOpen(true) }}><FaReceipt /></button></td>
                                    <td>{item.IsFraud}</td>
                                    <td>{item.IPAddress}</td>
                                    <td>
                                        <button onClick={() => DownloadPayinInvoice(item)}><FaFileInvoice /></button>
                                    </td>
                                    <td>{item.IPCity}</td>
                                    <td>{item.IPState}</td>                                    
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
                            <label style={{ lineBreak: "anywhere" }}>{payoutTrData.Response}</label>
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
                        <h2>CheckStatus Details</h2>
                        <div className="col-md-12">
                            <label>Check Status Date & Time</label>
                            <label>{payoutTrData.CheckStatusDateTime}</label>
                            <label>Check Status Response</label>
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