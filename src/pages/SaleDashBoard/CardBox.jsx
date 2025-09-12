import { Stack } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CardBox({ title, value, color }) {
    return (
        <Stack>
            {/* <div className="custom-card d-flex align-items-center">
                <div className="left-section" style={{ backgroundColor: color[0] }}>
                    <h6 className="mb-0 text-white">{title}</h6>
                </div>
            </div>
            <div className="circle">
                ₹
            </div>
            <div className="right-section" style={{ backgroundColor: color[1] }}>
                <h6 className="mb-0 text-white">{value}</h6>
            </div> */}

            <div className="row">
                <div className="col-sm-12">
                    <div className="card">
                        <div className="card-body" style={{backgroundColor:color[0]}}>
                            <h5 className="card-title text-white">{title}</h5>
                            <p className="card-text text-white">{value}</p>                            
                        </div>
                    </div>
                </div>
            </div>
        </Stack>
    )
}