import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate";
import { BindUserListByRoleId, BindAPIListByServiceName } from "../../services/Commonapi";
import { GetGarbagePayout, GetPayoutLedger } from "../../services/PayoutReport";
import Swal from "sweetalert2";

export default function GarbagePayout() {
    const [userList, setUserListValue] = useState(0);
    const [ApiMasterByServiceName, setApiMasterByServiceName] = useState(0);
    const [GarbagePayoutList, setGarbagePayoutList] = useState([]);
    const [IsRecieptOpen, setIsRecieptOpen] = useState(false);
    const [IsCallBackOpen, setIsCallBackOpen] = useState(false);
    const [IsCheckStatusOpen, setIsCheckStatusOpen] = useState(false);




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
        BindGarbagePayout({
            startDate: getToday(new Date()),
            endDate: getToday(new Date()),
            userId: 0,
            apiId: 0,
            pageNo: 0,
            pageSize: 100
        });
        BindUserList();
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

    const BindGarbagePayout = async (data) => {
        try {
            const _result = await GetGarbagePayout({
                startDate: data.startDate,
                endDate: data.endDate,
                userId: data.userId,
                apiId: data.apiId,
                pageNo: 0,
                pageSize: 100
            });
            setGarbagePayoutList(_result);
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
                <h2 className="mb-4">Garbage Payout Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindGarbagePayout)} >
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
                            <th>Service</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Name</th>
                            <th>Account No</th>
                            <th>IFSC</th>
                            <th>UPI</th>
                            <th>Unique Id</th>
                            <th>API Ref Id</th>
                            <th>Mode</th>
                            <th>IsCallBack Sent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {GarbagePayoutList && Array.isArray(GarbagePayoutList.data) && GarbagePayoutList.data.length > 0 ?
                            GarbagePayoutList.data.map((item, index) => (
                                <tr key={item.Id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.MobileNo}</td>
                                    <td>{item.ApiName}</td>
                                    <td>{item.CreatedDate}</td>                                    
                                    <td>
                                        {{
                                            pending: <img src="./StatusSvgIcon/Rtpending.svg" alt="Pending" />,
                                            success: <img src="./StatusSvgIcon/Rtsuccess.svg" alt="Success" />,
                                            failed: <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                        }[item.Status?.toLowerCase()] || (
                                                <img src="./StatusSvgIcon/Rtfailed.svg" alt="Failed" />
                                            )}
                                    </td>
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.TransactionAmount)}</td>
                                    <td>{item.AccountHolderName}</td>                                   
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>
                                    <td>{item.UPIId}</td>
                                    <td>{item.SystemUniqueId}</td>
                                    <td>{item.ApiUniqueId}</td>
                                    <td>{item.TransactionFrom}</td>
                                    <td>{item.IsCallback}</td>
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
                            <label>Failed Reason</label>
                            <label style={{ lineBreak: "anywhere" }}>{payoutTrData.Remarks}</label>
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