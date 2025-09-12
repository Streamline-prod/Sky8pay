import { Box } from "@mui/material"
import { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { BindUserListByRoleId } from "../../services/Commonapi";
import { useForm } from "react-hook-form";
import { getToday } from "../../utils/CurrentDate"
import { BindFundRequest } from "../../services/FundRequest";
import { StatusEnum } from "../../enums/StatusEnum";
import { FaEye } from "react-icons/fa";

export default function SuccessFundRequest() {

    const [userList, setUserListValue] = useState([]);
    const [fundrequest, setFundrequest] = useState([]);
    //const [searchText, setSeachText] = useState("");
    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        defaultValues: {
            startDate: getToday(new Date()), // yyyy-MM-dd format
            endDate: getToday(new Date())
        }
    });


    useEffect(() => {
        BindUserList();
        BindSuccessFundRequest({
            userId: 0,
            roleId: 0,
            startDate: getToday(new Date()),
            endDate: getToday(new Date()),
            pageNo: 0,
            pageSize: 100,
            status: StatusEnum.Sucess
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

    const BindSuccessFundRequest = async (data) => {
        try {
            const _result = await BindFundRequest(
                {
                    userId: data.userId,
                    roleId: 0,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    pageNo: 0,
                    pageSize: 100,
                    status: StatusEnum.Sucess
                }
            );
            setFundrequest(_result);
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

    // const filteredData = fundrequest.filter((item) =>
    //     Object.values(item).some((val) =>
    //         String(val).toLowerCase().includes(searchText.toLowerCase())
    //     )
    // );

    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="container mt-4">
                <h2 className="mb-4">Success Fund Report</h2>
                <form className="row g-3" onSubmit={handleSubmit(BindSuccessFundRequest)}>
                    <div className="col-md-6">
                        <label>From Date</label>
                        <input type="date" className="form-control" {...register("startDate")}  max={new Date().toISOString().split("T")[0]} />
                    </div>
                    <div className="col-md-6">
                        <label>To Date</label>
                        <input type="date" className="form-control" {...register("endDate")}  max={new Date().toISOString().split("T")[0]} />
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
                        <label>Search</label>
                        <input type="text" className="form-control" name="search" />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-success me-2">Search</button>
                        <button className="btn btn-secondary me-2">Back</button>
                    </div>
                </form>
            </div>
            <div className="container mt-4">
                <table className="table table-striped table-bordered table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>User Name</th>
                            <th>Company</th>
                            <th>UPI</th>
                            <th>Acc/No</th>
                            <th>Ifsc</th>
                            <th>Paymode</th>
                            <th>Utr no</th>
                            <th>Amount</th>
                            <th>Req Date</th>
                            <th>Comment</th>
                            <th>Upline Comment</th>
                            <th>Date & Time</th>
                            <th>Update Date & Time</th>
                            <th>Receipt</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fundrequest && Array.isArray(fundrequest.data) && fundrequest.data.length > 0 ?
                            fundrequest.data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.Name}</td>
                                    <td>{item.CompanyName}</td>
                                    <td>{item.Upi}</td>
                                    <td>{item.AccountNo}</td>
                                    <td>{item.IfscCode}</td>
                                    <td>{item.PaymentMode}</td>
                                    <td>{item.PaymentRequestUTR}</td>                                    
                                    <td>{new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.Amount)}</td>
                                    <td>{item.PaymentDate}</td>
                                    <td>{item.Customercomment}</td>
                                    <td>{item.UplineComment}</td>
                                    <td>{item.CreatedDate}</td>
                                    <td>{item.ModifiedDate}</td>
                                    <td><a href={item.PaymentRecipiet} target="_blank" className="text-blue-500 hover:text-blue-700 mx-2"><FaEye /></a></td>
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
        </Box >
    )
}