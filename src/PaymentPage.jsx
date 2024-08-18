// PaymentPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CashIcon from './Icon/CashIcon';
import CardIcon from './Icon/CardIcon';
import UPIIcon from './Icon/UPIIcon';
import WalletIcon from './Icon/WalletIcon';
import { logo } from './assets';
import { FaCheck, FaArrowRight } from 'react-icons/fa';
import usePromoCodeStore from './promoCodeStore';

const PaymentPage = ({ orderDetails, onPlaceOrder }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const totalPayment = orderDetails.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  const platformFeePercentage = 0.02;
  const gstPercentage = 0.18;

  const platformFee = totalPayment * platformFeePercentage;
  const gst = totalPayment * gstPercentage;

  // Get promo code and discounted total from the location state
  const { promoCode, discountedTotal } = location.state || {};

  // Get promoCode and appliedDiscount from the usePromoCodeStore
  const promoCodeFromStore = usePromoCodeStore((state) => state.promoCode);
  const appliedDiscountFromStore = usePromoCodeStore((state) => state.appliedDiscount);

  // Update promoCode and discountedTotal if available in the store
  const updatedPromoCode = promoCode || promoCodeFromStore;
  const updatedDiscountedTotal = discountedTotal || totalPayment * appliedDiscountFromStore;

  const totalAmountPayable = totalPayment + platformFee + gst;
  const totalPayable = totalAmountPayable - updatedDiscountedTotal; // Calculate total payable

  const paymentOptions = [
    { method: 'Cash on Delivery', icon: <CashIcon /> },
    { method: 'Card', icon: <CardIcon /> },
    { method: 'UPI', icon: <UPIIcon /> },
    { method: 'Wallet', icon: <WalletIcon /> },
  ];

  const handlePaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleProceedToConfirmation = () => {
    if (selectedPaymentMethod) {
      const confirmationData = onPlaceOrder(selectedPaymentMethod);
      navigate(`/confirmation`, {
        state: {
          ...confirmationData,
          paymentDetails: {
            totalPayment,
            platformFee,
            gst,
            totalAmountPayable,
            promoCode: updatedPromoCode,
            discountedTotal: updatedDiscountedTotal,
          },
        },
      });
    } else {
      alert('Please select a payment method.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Choose Your Payment Method</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {paymentOptions.map((option) => (
          <div
            key={option.method}
            className={`flex items-center p-4 border border-gray-300 rounded cursor-pointer ${
              selectedPaymentMethod === option.method ? 'bg-gray-800 text-white' : ''
            }`}
            onClick={() => handlePaymentSelection(option.method)}
          >
            <div className="mr-2">
              {selectedPaymentMethod === option.method ? <FaCheck className="text-green-500" /> : <FaArrowRight />}
            </div>
            <div className="mr-2">{option.icon}</div>
            {option.method}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded p-4 border">
        <div className="flex items-center mb-4">
          <img src={logo} alt="logo" className="w-20 object-contain mr-4" />
          <h2 className="text-xl font-semibold">Order Summary</h2>
        </div>
        <p className="mb-2 text-lg">Total Payment: ${totalPayment.toFixed(2)}</p>
        <p className="mb-2 text-lg">Platform Fee (2%): ${platformFee.toFixed(2)}</p>
        <p className="mb-2 text-lg">GST (18%): ${gst.toFixed(2)}</p>
        {updatedPromoCode && <p className="mb-2 text-lg">Promo Code Applied: {updatedPromoCode}</p>}
        {updatedDiscountedTotal && <p className="mb-2 text-lg">Discounted Total: ${updatedDiscountedTotal.toFixed(2)}</p>}
        <p className="text-2xl font-bold">Total Payable: ${totalPayable.toFixed(2)}</p>
      </div>

      <hr className="my-8" />

      <button
        onClick={handleProceedToConfirmation}
        className="bg-green-500 text-white py-2 px-4 rounded-full mt-4 flex items-center"
      >
        {selectedPaymentMethod && <div className="mr-2">{paymentOptions.find((option) => option.method === selectedPaymentMethod).icon}</div>}
        Proceed to Confirmation
      </button>
    </div>
  );
};

export default PaymentPage;
