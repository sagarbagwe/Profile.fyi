// CheckoutPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { logo } from './assets';
import { FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';
import usePromoCodeStore from './promoCodeStore';

const CheckoutPage = ({ orderDetails }) => {
  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  const deliveryDetails = {
    name: 'Sagar Bagwe',
    address: '123 Main St, Cityville, State, 12345',
    contact: '+91 8276282872',
  };

  const [quantity, setQuantity] = useState(1);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [orderTotal, setOrderTotal] = useState(
    orderDetails.products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  );

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const promoCodeStore = usePromoCodeStore();
  const [promoCodeInput, setPromoCodeInput] = useState('');

  const availablePromoCodes = ['groww', 'growwwithgroww', 'sde_intern'];

  const applyPromoCode = () => {
    const promoCode = promoCodeInput.toLowerCase();
    let appliedDiscount = 0;

    if (availablePromoCodes.includes(promoCode)) {
      switch (promoCode) {
        case 'groww':
          appliedDiscount = 0.2; // 20%
          break;
        case 'growwwithgroww':
          appliedDiscount = 0.3; // 20%
          break;
        case 'sde_intern':
          appliedDiscount = 0.4; // 40%
          break;
        default:
          break;
      }

      promoCodeStore.setPromoCode(promoCode);
      promoCodeStore.setAppliedDiscount(appliedDiscount);
    } else {
      alert('Invalid promo code');
    }
  };

  const discountedTotal = orderTotal - orderTotal * promoCodeStore.appliedDiscount;

  const handleButtonClick = () => {
    setButtonClicked(true);
    // Additional logic or redirection to the payment page can be added here
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="logo" className="w-20 object-contain" />
        </Link>

        {/* Checkout heading */}
        <h1 className="text-2xl font-bold">Checkout</h1>
      </div>

      {/* Delivery Details */}
      <div className="mb-4 rounded p-4 border bg-gray-200">
        <h2 className="text-xl font-semibold mb-2">Delivery Details</h2>
        <div className="flex items-center mb-2">
          <FaUser className="inline-block mr-2" />
          <p>{deliveryDetails.name}</p>
        </div>
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="inline-block mr-2" />
          <p>{deliveryDetails.address}</p>
        </div>
        <div className="flex items-center">
          <FaPhone className="inline-block mr-2" />
          <p>{deliveryDetails.contact}</p>
        </div>
      </div>

      {/* Order List */}
      <div className="mb-4 rounded p-4 border">
        <h2 className="text-xl font-semibold mb-2">Order List</h2>
        <ol className="list-none pl-8">
          {orderDetails.products.map((product, index) => (
            <li key={product.id} className="border rounded-lg p-4 mb-2 bg-gray-100 hover:shadow-md transition duration-300">
              <div className="flex items-center">
                {product.title && (
                  <img src={product.image} alt={product.title} className="w-10 h-10 object-cover mr-2 rounded-full" />
                )}
                {product.title ? (
                  <>
                    <span className="text-gray-800">{product.title} - ${(product.price * product.quantity).toFixed(2)}</span>
                    <div className="ml-auto flex items-center">
                      <button onClick={handleDecrement} className="bg-green-500 text-white py-1 px-2 rounded-l">
                        -
                      </button>
                      <span className="bg-blue-100 text-blue-500 py-1 px-4">{quantity}</span>
                      <button onClick={handleIncrement} className="bg-green-500 text-white py-1 px-2 rounded-r">
                        +
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-gray-800">Product - ${(product.price * product.quantity).toFixed(2)} x {product.quantity}</span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Promo Code Drawer */}
      <div className="mb-4 rounded p-4 border">
        <h2 className="text-xl font-semibold mb-2">Apply Promo Code</h2>
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="border p-2 mr-2 text-sm" // Apply text-sm class for smaller text
            value={promoCodeInput}
            onChange={(e) => setPromoCodeInput(e.target.value)}
            style={{ cursor: 'text' }} // Set cursor style to text
          />
          <button onClick={applyPromoCode} className="bg-gray-800 text-white py-2 px-4 rounded-full text-sm">
            Apply
          </button>
        </div>
        {promoCodeStore.promoCode && (
          <p className="mt-2 text-green-500">
            Promo code "{promoCodeStore.promoCode}" applied. Discount: {promoCodeStore.appliedDiscount * 100}%
          </p>
        )}

        {/* Display all available promo codes */}
        <div className="mt-2">
          <p>All Available Promo Codes:</p>
          <div className="flex flex-wrap">
            {availablePromoCodes.map((code) => (
              <button
                key={code}
                onClick={() => {
                  // Logic to copy the promo code to the clipboard
                  navigator.clipboard.writeText(code);
                  alert(`Copied promo code: ${code}`);
                }}
                className="bg-gray-800 text-white py-2 px-4 rounded-full mr-2 mb-2 lowercase text-sm" // Apply text-sm class for smaller text
              >
                {code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="mb-4 rounded p-4 border">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
        <p>Total Items: {orderDetails.products.length}</p>
        <p>Order Total: ${orderDetails.products.reduce((sum, product) => sum + product.price * product.quantity, 0).toFixed(2)}</p>
        {promoCodeStore.promoCode && (
          <>
            <p>Promo Code Applied: {promoCodeStore.promoCode}</p>
            <p>Discounted Total: ${discountedTotal.toFixed(2)}</p>
          </>
        )}
      </div>

      {/* Continue to Payment Button */}
      <Link
        to="/payment"
        onClick={handleButtonClick}
        className={`py-2 px-4 rounded-full ${buttonClicked ? 'bg-green-500' : 'bg-indigo-500'} text-white`}
      >
        Continue to Payment
      </Link>
    </div>
  );
};

export default CheckoutPage;
