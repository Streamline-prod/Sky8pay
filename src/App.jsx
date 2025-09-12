import * as React from 'react';

import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/Dashboard/AppNavbar';
import Header from './components/DashBoard/Header';
import MainGrid from './components/Dashboard/MainGrid';
import SideMenu from './components/Dashboard/SideMenu';
import AppTheme from './Shared-theme/AppTheme';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import Sales from './pages/SaleDashBoard/Sales';
import CreateInvoice from './pages/Invoice/CreateInvoice';
import PendingFundRequest from './pages/FundRequest/PendingFundRequest';
import FailedFundRequest from './pages/FundRequest/FailedFundRequest';
import SuccessFundRequest from './pages/FundRequest/SuccessFundRequest';
import BankMaster from './pages/FundRequest/BankMaster';
import SettlementSetting from './pages/SettlementRequest/SettlementSetting';
import PendingSettlementRequest from './pages/SettlementRequest/PendingSettlementRequest';
import ApprovedSettlementRequest from './pages/SettlementRequest/ApprovedSettlementRequest';
import LoanRequestReport from './pages/LoanRequest/LoanRequestReport';
import LoanLedgerReport from './pages/LoanRequest/LoanLedgerReport';
import LoanSummaryReport from './pages/LoanRequest/LoanSummaryReport';
import LoanRecovered from './pages/LoanRequest/LoanRecovered';
import LifeTimeLoanReport from './pages/LoanRequest/LifeTimeLoanReport';
import UtilityReport from './pages/Utility/UtilityReport';
import DirectSurchargeCreditDebit from './pages/DirectCommission/DirectSurchargeCreditDebit';
import PayinReport from './pages/DirectCommission/PayinReport';
import SurchargeDeduct from './pages/DirectCommission/SurchargeDeduct';
import SurchargeDeductSummary from './pages/DirectCommission/SurchargeDeductSummary';;
import LifeTimeDeductReport from './pages/DirectCommission/LifeTimeDeductReport';
import SearchChargeback from './pages/Chargeback/SearchChargeback';
import ChargebackReport from './pages/Chargeback/ChargebackReport';
import ManageLien from './pages/Lien/ManageLien';
import DeletedLien from './pages/Lien/DeletedLien';
import TicketReport from './pages/HelpDesk/TicketReport';
import FraudCustomer from './pages/HelpDesk/FraudCustomer';
import PayoutReport from './pages/PayoutReports/PayoutReport';
//import { useEffect, useState } from "react";
//import Spinner from './components/Loader/Spinner';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

//const [loading, setLoading] = useState(true);
const mainListItems = [
  { text: 'Dashboard', icon: <HomeRoundedIcon />, path: "/" },
  { text: 'Sale', icon: <img src="/icons/sale.svg" alt="sale" width={16} height={16} />, path: "/Sales" },
  { text: 'Create Invoice', icon: <img src="/icons/sale.svg" alt="sale" width={16} height={16} />, path: "/CreateInvoice" },
  {
    text: 'Fund Request',
    icon: <img src="/icons/fundRequest.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Pending Fund", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/PendingFundRequest" },
      { text: "Failed Fund", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/FailedFundRequest" },
      { text: "Success Fund", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/SuccessFundRequest" },
      { text: "Bank Master", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/BankMaster" },
      { text: "Settlement Setting", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/SettlementSetting" },
      { text: "Pending Settlement Request", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/PendingSettlementRequest" },
      { text: "Approved Settlement Request", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/ApprovedSettlementRequest" },
    ],
  },
  {
    text: 'Loan Request',
    icon: <img src="/icons/loanRequest.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Loan Request Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/LoanRequestReport" },
      { text: "Loan Ledger Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/LoanLedgerReport" },
      { text: "Loan Summary Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/LoanSummaryReport" },
      { text: "Loan Recovered", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/LoanRecovered" },
      { text: "LifeTime Loan Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/LifeTimeLoanReport" }
    ],
  },
  {
    text: 'Utility Payments',
    icon: <img src="/icons/utilityBills.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Utility Reports", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/UtilityReport" }
    ],
  },
  {
    text: 'Direct Commission',
    icon: <img src="/icons/Discount.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Direct Surcharge Cr/Dr", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/DirectSurchargeCreditDebit" },
      { text: "Payin Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/PayinReport" },
      { text: "Surcharge Deduct", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/SurchargeDeduct" },
      { text: "Surcharge Deduct Summary", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/SurchargeDeductSummary" },
      { text: "Life Time Deduct Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/LifeTimeDeductReport" }
    ],
  },
  {
    text: 'Chargebacks',
    icon: <img src="/icons/chargeback.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Chargebacks", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/SearchChargeback" },
      { text: "Charge Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/ChargebackReport" }
    ],
  },
  {
    text: 'Lien',
    icon: <img src="/icons/lienAmount.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Manage Lien", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/ManageLien" },
      { text: "Remove Lien Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/DeletedLien" }
    ],
  },
  {
    text: 'HelpDesk',
    icon: <img src="/icons/helpdesk.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Ticket Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Fraud Customers", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/FraudCustomer" }
    ],
  },
  {
    text: 'Manage Customer',
    icon: <img src="/icons/manageCustomer.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: "Create Customer", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manage Permission", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manage InstantWallet", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Active Customers", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "User Login History", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Promote User", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "InActive Customers", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "User Wallet Balance", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manage User Wallet", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Recon History", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Upline ApiWallet", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Api Merchant Details", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Smart Collect',
    icon: <img src="/icons/manageCustomer.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Create VA", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "VA Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Active VA Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }

    ]
  },
  {
    text: 'Payout Reports',
    icon: <img src="/icons/payoutreport.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Payout Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/PayoutReport" },
      { text: "Pending Payout", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Payout Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Garbage Payout", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Bulk Payout", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Unsettled Reports',
    icon: <img src="/icons/payinreport.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: "Unsettled Payin", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Pending Unsettled", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Failed Unsettled", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Unsettled Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }

    ],
  },
  {
    text: 'Settled Reports',
    icon: <img src="/icons/payinreport.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Settled Payin", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Pending Settled", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Failed Settled", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Settled Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Settled Wallet',
    icon: <img src="/icons/settledWallet.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Credit Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Debit Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Cr/Dr Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ]
  },
  {
    text: 'UnSettled Wallet',
    icon: <img src="/icons/unsettledWallet.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: "Credit Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Debit Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Cr/Dr Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }

    ],
  },
  {
    text: 'Manage API',
    icon: <img src="/icons/ManageApi.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: " Given API Profit", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "API Fund", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "API Fund Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "API Company Details", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manage Slab", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Switch Payin", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Set Payout Limit", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Payin Setup", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Commission',
    icon: <img src="/icons/Discount.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: "Create Category", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Set Value", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Commission Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Search',
    icon: <img src="/icons/Search.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Payin Search", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Payout Search", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Top Payin Txn", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Duplicate UTR", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Duplicate UnSettled Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'BroadCast',
    icon: <img src="/icons/broadcast.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: "Notification", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "PopUp", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Shoot Email", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Shoot WhatsApp", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Banners", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Send Chrome Nt.", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Admin Wallet',
    icon: <img src="/icons/adminWallet.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "Credit Yourself", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Debit Yourself", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Admin Profit", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "LifeTime Comm.", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Earn Comm.", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Unsettled Comm.", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manual Comm.", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manual Comm Cr/Dr", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Manual Comm Cr/Dr Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'GST',
    icon: <img src="/icons/gst.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "GST Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Pay GST", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "GST Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "User Wise Gst", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'TDS',
    icon: <img src="/icons/tds.svg" alt="sale" width={16} height={16} />,
    children: [
      { text: "TDS Report", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Pay TDS", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "TDS Ledger", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "User Wise Tds", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },
  {
    text: 'Manage Employee',
    icon: <img src="/icons/manaageEmployee.svg" alt="sale" width={16} height={16} />,
    children: [

      { text: "Create Employee", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Active Employee", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "InActive Employee", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" },
      { text: "Employee Login History", icon: <strong style={{ fontSize: "22px" }}>&bull;</strong>, path: "/TicketReport" }
    ],
  },

];



export default function App(props) {
  // useEffect(() => {
  //   setTimeout(() => setLoading(false), 3000);
  // }, []);
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Router>
        <Box sx={{ display: 'flex' }}>
          {/* <div>
            {loading ? <Spinner /> : <h1>✅ Data Loaded!</h1>}
          </div> */}
          <SideMenu items={mainListItems} />

          <AppNavbar />
          {/* Main content */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 3,
                pb: 5,
                mt: { xs: 8, md: 0 },
              }}
            >
              <Header />
              <Routes>
                <Route path="/" element={<MainGrid />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/createinvoice" element={<CreateInvoice />} />
                <Route path="/pendingfundrequest" element={<PendingFundRequest />} />
                <Route path="/failedfundrequest" element={<FailedFundRequest />} />
                <Route path="/successfundrequest" element={<SuccessFundRequest />} />
                <Route path="/bankmaster" element={<BankMaster />} />
                <Route path="/SettlementSetting" element={<SettlementSetting />} />
                <Route path="/PendingSettlementRequest" element={<PendingSettlementRequest />} />
                <Route path="/ApprovedSettlementRequest" element={<ApprovedSettlementRequest />} />

                <Route path="/LoanRequestReport" element={<LoanRequestReport />} />
                <Route path="/LoanLedgerReport" element={<LoanLedgerReport />} />
                <Route path="/LoanSummaryReport" element={<LoanSummaryReport />} />
                <Route path="/LoanRecovered" element={<LoanRecovered />} />
                <Route path="/LifeTimeLoanReport" element={<LifeTimeLoanReport />} />
                <Route path="/UtilityReport" element={<UtilityReport />} />

                <Route path="/DirectSurchargeCreditDebit" element={<DirectSurchargeCreditDebit />} />
                <Route path="/payinreport" element={<PayinReport />} />
                <Route path="/SurchargeDeduct" element={<SurchargeDeduct />} />
                <Route path="/SurchargeDeductSummary" element={<SurchargeDeductSummary />} />
                <Route path="/LifeTimeDeductReport" element={<LifeTimeDeductReport />} />

                <Route path="/SearchChargeback" element={<SearchChargeback />} />
                <Route path="/ChargebackReport" element={<ChargebackReport />} />

                <Route path="/ManageLien" element={<ManageLien />} />
                <Route path="/DeletedLien" element={<DeletedLien />} />

                <Route path='/PayoutReport' element={<PayoutReport />} />

                
                <Route path="/TicketReport" element={<TicketReport />} />
                <Route path="/FraudCustomer" element={<FraudCustomer />} />

              </Routes>
            </Stack>
          </Box>
        </Box>
      </Router>
    </AppTheme>
  );
}
