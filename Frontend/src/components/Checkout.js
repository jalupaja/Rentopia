import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box, Typography
} from "@mui/material";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import DatePicker from "./DatePicker";

function CheckoutDialog({ open, handleCheckoutClose, device }) {
    const [step, setStep] = useState(1);
    const handleNext = () => {
        setStep(2);
    }
    const handleBack = () => {
        setStep(1);
    }

    return (
        <Dialog
            open={open}
            onClose={() => {handleCheckoutClose(); setStep(1)}}
            maxWidth="sm"
            fullWidth
            PaperProps={{component: 'form'}}
        >
            <DialogTitle>Checkout</DialogTitle>

            <DialogContent>
                {step === 1 && (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <DatePicker/>
                    </Box>
                )}

                {step === 2 && (
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" padding={2}>
                        {/* Order Details Section */}
                        <Box>
                            <Typography variant="h6">Order Details</Typography>
                            <Typography variant="body1" gutterBottom>Product: "Name"</Typography>
                            <Typography variant="body1" gutterBottom>Price: "Price"</Typography>
                            <Typography variant="body1">Date Range: "DateRange"</Typography>
                        </Box>

                        {/* PayPal Integration */}
                        <Box sx={{display: "flex", alignItems: "center", marginTop: "auto", marginBottom: "0px"}}>
                            <PayPalScriptProvider options={{ "client-id": `${process.env.REACT_APP_PAYPAL_CLIENT_ID}` /*TODO: fix env call*/ }}>
                                <PayPalButtons
                                    style={{ layout: "vertical" }}
                                    fundingSource={"paypal"}
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [
                                                {
                                                    amount: {
                                                        value: "10.0", // Set the correct price here
                                                    },
                                                },
                                            ],
                                        });
                                    }}
                                    onApprove={(data, actions) => {
                                        return actions.order.capture().then((details) => {
                                            alert(`Transaction completed`);
                                        });
                                    }}
                                />
                            </PayPalScriptProvider>
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                {/* Cancel Button */}
                <Button onClick={() => {handleCheckoutClose(); setStep(1)}} color="error">
                    Cancel
                </Button>

                {/* Navigation Buttons */}
                {step === 1 && (
                    <Button onClick={handleNext} variant="contained">
                        Continue
                    </Button>
                )}

                {step === 2 && (
                    <>
                        <Button onClick={handleBack} variant="outlined">
                            Back
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
}

export default CheckoutDialog;
