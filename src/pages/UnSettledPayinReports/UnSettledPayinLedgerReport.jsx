import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BindUserListByRoleId, BindAPIListByServiceName, BindMasterData } from "../../services/Commonapi";
import { FaReceipt } from "react-icons/fa";
import Swal from "sweetalert2";
import { GetUnsettledPayinLedger, GetUnsettledPayinReport } from "../../services/PayinReport";
import { getToday } from "../../utils/CurrentDate";

export default function UnSettledPayinLedgerReport() {
    const [userList, setUserListValue] = useState(0);
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState(0);
    const [PayinReportList, setPayinReportList] = useState([]);
    const [IsRecieptOpen, setIsRecieptOpen] = useState(false);
    const [IsCallBackOpen, setIsCallBackOpen] = useState(false);
    const [IsCheckStatusOpen, setIsCheckStatusOpen] = useState(false);
    const [payoutTrData, setPayoutTrData] = useState(null);
    const [statusMasterdropdown, setStatusMasterDrowdown] = useState(0);
    const [txntypeMasterdropdown, settxntypeMasterDrowdown] = useState(0);



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
        BindPayinledgerReport({
            userId: 0,
            startDate: null,
            endDate: null,
            apiId: 0,
            status: 0,
            search: "",
            pageNo: 0,
            pageSize: 100,
            txnFrom: 0,
            mode: 0
        });
        BindStatusDropdown();
        BindAPIListServiceName();
        BindtransactionTypeDropdown();
    }, []);


    const BindStatusDropdown = async () => {
        try {
            const _result = await BindMasterData({
                type: "status"
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

    const BindtransactionTypeDropdown = async () => {
        try {
            const _result = await BindMasterData({
                type: "txntype"
            });
            settxntypeMasterDrowdown(_result);
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

    const BindPayinledgerReport = async (data) => {
        try {
            const _result = await GetUnsettledPayinLedger({
                userId: data.userId,
                startDate: data.startDate ? data.startDate : null,
                endDate: data.endDate ? data.endDate : null,
                apiId: data.apiId,
                status: data.statusId,
                search: data.search,
                transactionTypeId: data.typeId,
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
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">UnSettled Failed Payin Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindPayinledgerReport)} >
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
                        <label className="form-label">Select Type</label>
                        <select className="form-control" {...register("typeId")}>
                            <option value={0} key={0}>Select Type</option>
                            {txntypeMasterdropdown && Array.isArray(txntypeMasterdropdown.data) && txntypeMasterdropdown.data.length > 0 ?
                                txntypeMasterdropdown.data.filter(x => x.Id === 1 || x.Id === 2).map((item) => (
                                    <option value={item.Id}>{item.TypeName}</option>
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
                            <th>Service Name</th>
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
                        {PayinReportList && Array.isArray(PayinReportList.data) && PayinReportList.data.length > 0 ?
                            PayinReportList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.ApiName ? item.ApiName : item.ServiceName}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>
                                        {{
                                            pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                            success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                            failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                        }[item.STATUS?.toLowerCase()] || (
                                                <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />
                                            )}
                                    </td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.BankUTRNo}</td>
                                    <td>{item.TransactionType}</td>
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
                        <h2>CheckStatus Details</h2>
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