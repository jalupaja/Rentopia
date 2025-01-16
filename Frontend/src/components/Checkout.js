import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    Typography,
} from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import FetchBackend from "../helper/BackendHelper";
import {differenceInDays, format} from "date-fns";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';

function CheckoutDialog({ open, handleCheckoutClose, device, authUser, bookedRanges = [] }) {
    const [step, setStep] = useState(1);

    const calculateDateDifference = (startDate, endDate) => {
        return differenceInDays(new Date(endDate), new Date(startDate));
    };

    const [newFinance, setNewFinance] = useState({
        accountId: authUser ? authUser.id : null,
        deviceId: device ? device.id : null,
        amount: "0.00",
        processed: false,
        startDate: null,
        endDate: null,
    });

    const selectionRange = {
        startDate: newFinance.startDate || new Date(),
        endDate: newFinance.endDate || new Date(),
        key: 'selection',
    };

    const updateDates = (ranges) => {
        const { startDate, endDate } = ranges.selection; // Access the selection range
        const days = calculateDateDifference(startDate, endDate);
        const updatedAmount = (days * parseFloat(device.price)).toFixed(2).toString();
        setNewFinance((prev) => ({
            ...prev,
            startDate,
            endDate,
            amount: updatedAmount,
        }));
    };


    const handleNext = () => {
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleTransaction = () => {
        if (authUser) {
            FetchBackend("POST", "finance/add", newFinance)
                .then((res) => res.json())
                .then((data) => console.log(data))
                .catch((err) => console.log(err));
        }
    };

    return (
        <Dialog
            open={open}
            onClose={() => {
                handleCheckoutClose();
                setStep(1);
            }}
            maxWidth="sm"
            fullWidth
            PaperProps={{ component: "form" }}
        >
            <DialogTitle>Checkout</DialogTitle>

            <DialogContent>
                {step === 1 && (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Box sx={{ position: "relative", justifySelf: "center" }}>
                            <style>
                                {`
                                    .rdrDefinedRangesWrapper {
                                        display: none;
                                    }
                                    .rdrDateDisplayWrapper {
                                        display: none;
                                    }
                                    .rdrMonth {
                                    }
                                `}
                            </style>
                            <DateRangePicker
                                ranges={[selectionRange]}
                                onChange={updateDates} // This will pass the `ranges` object
                                disabledDates={bookedRanges}
                                minDate={new Date()}
                            />
                        </Box>
                    </Box>
                )}

                {step === 2 && (
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" padding={2}>
                        <Box>
                            <Typography variant="h5">Order Details</Typography>
                            <Typography variant="body1" gutterBottom>
                                Product: {device.title}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Price (per day): {device.price} €
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Total Days: {calculateDateDifference(newFinance.startDate, newFinance.endDate)}
                            </Typography>
                            <Typography variant="body1">
                                Total Price: {newFinance.amount} €
                            </Typography>
                            <Typography variant="body1">
                                Date Range: {newFinance.startDate ? format(newFinance.startDate, 'yyyy-MM-dd') : 'N/A'} -> {newFinance.endDate ? format(newFinance.endDate, 'yyyy-MM-dd') : 'N/A'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", marginTop: "auto", marginBottom: "0px" }}>
                            <PayPalScriptProvider
                                options={{
                                    "client-id":
                                        "AWmGdlDiePv7XLRgvZx5toU4QYFvXJJyIl_GYm1Kcl3k8i9vYDURK8flhLWBrex4NLNFjVN5aixmy9Ca" /* TODO: fix env call */,
                                }}
                            >
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    fundingSource={"paypal"}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: newFinance.amount,
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            handleTransaction();
                                            handleCheckoutClose();
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button
                    onClick={() => {
                        handleCheckoutClose();
                        setStep(1);
                    }}
                    color="error"
                >
                    Cancel
                </Button>

                {step === 1 && (
                    <Button onClick={handleNext} variant="contained">
                        Continue
                    </Button>
                )}

                {step === 2 && (
                    <Button onClick={handleBack} variant="outlined">
                        Back
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default CheckoutDialog;
