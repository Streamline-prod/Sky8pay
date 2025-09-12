import api from "./api";

export const GetPayoutReports=async(payload={})=>{
    try{
const response=await api.post("/PayoutReport/GetPayoutReport",payload);
return response.data;
    }catch(error){
        console.log("Error fetch payout report",error);
        throw error;
    }
}