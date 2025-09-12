import { Box } from "@mui/material";
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import CardBox from "./CardBox";
import { GetSaleDashBoard } from "../../services/SaleDashBoard";
import { useEffect, useState } from "react";
import { BindAPI } from "../../services/Commonapi";

function SaleList(apiId, startDate, endDate) {
    const [saledata, setSales] = useState([]);
    //const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [filterType, setFilterType] = useState("today");
    const [apiOptions, setApiOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState(0);


    useEffect(() => {
        apiFetchData();
        handleDateChange("today");
    }, []);

    const apiFetchData = async () => {
        try {
            const data = await BindAPI(
                {
                    RoleId: 2
                }
            )
            setApiOptions(data);
        } catch (err) {
            setError(err.message || "something went wrong");
        } finally {

        }
    }

    const fetchData = async (range, apiId) => {
        try {
            //setLoading(true);
            const data = await GetSaleDashBoard(
                {
                    apiId: apiId,
                    startDate: range.startDate,
                    endDate: range.endDate
                }
            );
            setSales(data);
        } catch (err) {
            setError(err.message || "something went wrong");
        } finally {
            //setLoading(false);
        }
    };

    const handleApiChange = (e) => {
        const apiId = parseInt(e.target.value);        
        setSelectedValue(apiId);
        fetchData(dateRange, apiId);
    }
    const handleDateChange = (type) => {
        setFilterType(type);
        const today = new Date();
        switch (type) {
            case "today":
                startDate = endDate = today.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
                break;
            case "yesterday":
                const yest = new Date(today);
                yest.setDate(today.getDate() - 1);
                startDate = endDate = yest.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
                break;
            case "7days":
                const last7 = new Date(today);
                last7.setDate(today.getDate() - 7);
                startDate = last7.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
                endDate = today.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
                break;
            case "30days":
                const last30 = new Date(today);
                last30.setDate(today.getDate() - 30);
                startDate = last30.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
                endDate = today.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
                break;
            default:
                startDate = endDate = today.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata" // force IST
                });
        }
        const range = { startDate, endDate };
        setDateRange(range);
        fetchData(range, selectedValue);
    }


    // if (loading) return <p>Loading...</p>;
    // if (error) return <p>Error: {error}</p>;
    // <div>
    //     {loading?<Spinner />:<p>Data loaded ✅</p>}
    // </div>


    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <div className="row mb-3">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="col-sm-3">
                                <select className="form-control" onChange={handleApiChange} id="ddlapi">
                                    {/* {apiOptions && apiOptions.data ?
                                    Object.entries(apiOptions.data).map((item) =>
                                        //<option key={item.id} value={item.id}>{item.name}</option>
                                    ) : (
                                        <option>No Data Found</option>
                                    )} */}
                                    <option key={0} value={0}>Select API</option>
                                    {apiOptions && Array.isArray(apiOptions.data) && apiOptions.data.length > 0 ?
                                        apiOptions.data.map((item) => (
                                            <option value={item.id}>{item.name}</option>
                                        )) : (
                                            <option>No Data Found</option>
                                        )}
                                </select>
                            </div>
                            <div className="col-sm-3"></div>
                            {/* <Dropdown>
                                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Select API
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {apiOptions && Array.isArray(apiOptions.data) && apiOptions.data.length>0 ?
                                        apiOptions.data.map((item) =>(
                                            <Dropdown.Item key={item.id} value={item.id}>{item.name}</Dropdown.Item>
                                        )) : (
                                            <Dropdown.Item>No Data Found</Dropdown.Item>
                                        )}                                  
                                </Dropdown.Menu>
                            </Dropdown> */}
                            <div className="col-sm-6">
                                <ButtonToolbar>
                                    <ButtonGroup>
                                        <Button type="button" variant="dark" className="rounded-pill px-3" onClick={(e) => { e.preventDefault(); handleDateChange("today") }}>TODAY</Button>
                                        <Button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("yesterday")}>YESTERDAY</Button>
                                        <Button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("7days")}>7 DAYS</Button>
                                        <Button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("30days")}>30 DAYS</Button>
                                        <Button type="button" variant="light" className="rounded-pill px-3" onClick={() => handleDateChange("custom")}>CUSTOM DATE</Button>
                                        {filterType == "custom" && (
                                            <div>
                                                <input type="date" onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })
                                                } />
                                                <input type="date" onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })
                                                } />
                                                <Button onClick={() => fetchData(dateRange)}>Search</Button>
                                            </div>
                                        )}
                                    </ButtonGroup>
                                </ButtonToolbar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {saledata && Array.isArray(saledata.data) && saledata.data.length > 0 ? (
                    saledata.data.map((item, index) => (
                        <div className="col-sm-4 mb-3">
                            <CardBox
                                title={item.metric}
                                value={new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(item.value)}
                                color={["#6c757d", "#adb5bd"]} />
                        </div>
                    ))
                ) : (
                    <p>No data found</p>
                )}
            </div>
        </Box>
    )
}

export default function Sales() {
    return (
        <Box>
            <SaleList />
        </Box>
    )
}
