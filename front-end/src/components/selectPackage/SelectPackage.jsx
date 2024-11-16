import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PgwQeRsPs7LocjUEplV8ZtqASWq9qNoAYtmFCCwyicLgTXcYS6V6yVRXRyZAPvg9zBL5yx6HHuUQUorkM05go1v0021YtXR4L');

const SelectPackage = ({ upgrade = false, onCancel }) => {
  const { palette } = useTheme();
  const [days, setDays] = useState(30);
  const [bandwidth, setBandwidth] = useState(10);
  const [storage, setStorage] = useState(100);
  const [price, setPrice] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const availableDays = [7, 14, 30, 60, 90];
  const availableBandwidth = [5, 10, 20, 50, 100];
  const availableStorage = [50, 100, 200, 500, 1000];

  const pricing = {
    perDay: 2,
    perGbBandwidth: 1,
    perGbStorage: 0.5,
  };

  const calculatePrice = () => {
    const totalPrice =
      days * pricing.perDay +
      bandwidth * pricing.perGbBandwidth +
      storage * pricing.perGbStorage;
    setPrice(totalPrice);
  };

  const handleDaysChange = (event) => {
    setDays(event.target.value);
    calculatePrice();
  };

  const handleBandwidthChange = (event) => {
    setBandwidth(event.target.value);
    calculatePrice();
  };

  const handleStorageChange = (event) => {
    setStorage(event.target.value);
    calculatePrice();
  };

  const handleSubscribeClick = () => {
    setOpenModal(true);
  };

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: palette.background.paper,
        borderRadius: '10px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" gutterBottom color={palette.text.primary}>
        Choose Your Package
      </Typography>

      <Box mb={3}>
        <Typography variant="h6" color={palette.text.secondary}>
          Select Days:
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Days</InputLabel>
          <Select value={days} onChange={handleDaysChange} label="Select Days">
            {availableDays.map((day) => (
              <MenuItem key={day} value={day}>
                {day} Days
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" color={palette.text.secondary}>
          Select Bandwidth (GB):
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Bandwidth</InputLabel>
          <Select value={bandwidth} onChange={handleBandwidthChange} label="Select Bandwidth">
            {availableBandwidth.map((band) => (
              <MenuItem key={band} value={band}>
                {band} GB
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" color={palette.text.secondary}>
          Select Storage (GB):
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Storage</InputLabel>
          <Select value={storage} onChange={handleStorageChange} label="Select Storage">
            {availableStorage.map((stor) => (
              <MenuItem key={stor} value={stor}>
                {stor} GB
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" color={palette.text.primary}>
          Total Price: ${price.toFixed(2)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        onClick={handleSubscribeClick}
        sx={{ padding: '12px', fontWeight: 'bold', borderRadius: '8px' }}
      >
        Subscribe Now
      </Button>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            width: 400,
            padding: 4,
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: 3,
            margin: 'auto',
            marginTop: '10%',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Enter Payment Details
          </Typography>

          <Elements stripe={stripePromise}>
            <StripePaymentForm price={price} setOpenModal={setOpenModal} />
          </Elements>
        </Box>
      </Modal>
    </div>
  );
};

const StripePaymentForm = ({ price, setOpenModal }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      alert(error.message);
    } else {
      console.log(paymentMethod);
      alert('Payment successful!');
      setOpenModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <Typography variant="h6" color="primary" mt={2}>
        Total: ${price.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={!stripe}
        fullWidth
        sx={{ marginTop: '16px' }}
      >
        Pay Now
      </Button>
    </form>
  );
};

export default SelectPackage;
