import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Analytics } from '@vercel/analytics/react';
import { logo } from './assets';
import CheckoutPage from './CheckoutPage';
import PaymentPage from './PaymentPage';
import OrderConfirmationPage from './OrderConfirmationPage';
import Home from './Home'; // Updated Home component

const App = () => {
  const theme = {
    "--background": "hsl(0, 0%, 100%)",
    "--foreground": "hsl(240, 10%, 3.9%)",
    "--primary": "hsl(240, 5.9%, 10%)",
    "--primary-foreground": "hsl(0, 0%, 98%)",
  };

  const [orderDetails, setOrderDetails] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetch('https://groww-intern-assignment.vercel.app/v1/api/order-details')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setOrderDetails(data))
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const handlePlaceOrder = (paymentMethod) => {
    const orderStatusOptions = ['Success', 'Failure', 'Pending'];
    const randomStatusIndex = Math.floor(Math.random() * orderStatusOptions.length);
    const randomOrderStatus = orderStatusOptions[randomStatusIndex];

    // Set the selected payment method
    setSelectedPaymentMethod(paymentMethod);

    // Return an object with data to be passed to the confirmation page
    return {
      orderDetails,
      selectedPaymentMethod: paymentMethod,
      orderStatus: randomOrderStatus,
    };
  };

  return (
    <BrowserRouter>
      <header
        style={{
          background: theme["--background"],
          borderBottom: `1px solid ${theme["--foreground"]}`,
        }}
        className="w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]"
      >
        <Link to="/home">
          <img src={logo} alt="logo" className="w-28 object-contain" />
        </Link>
        <div className="flex items-center">
          <Link to="/checkout" className="mr-4">
            <FontAwesomeIcon icon={faShoppingCart} className="text-xl mr-2" />
            Checkout
          </Link>
        </div>
      </header>
      <main
        style={{
          background: theme["--background"],
          minHeight: "calc(100vh - 73px)",
        }}
        className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh - 73px)]"
      >
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/home" element={<Home addToCart={addToCart} />} />
          <Route path="/checkout" element={<CheckoutPage orderDetails={orderDetails} />} />
          <Route
            path="/payment"
            element={
              orderDetails ? (
                <PaymentPage
                  orderDetails={orderDetails}
                  onPlaceOrder={handlePlaceOrder}
                />
              ) : null
            }
          />
          <Route
            path="/confirmation/*"
            element={<OrderConfirmationPage />}
          />
        </Routes>
        <Analytics />
      </main>
      <footer
        style={{
          background: theme["--foreground"],
          color: theme["--primary-foreground"],
          textAlign: "center",
          padding: "1rem",
        }}
        className="w-full"
      >
        <p>&copy; 2024 Sagar Bagwe</p>
      </footer>
    </BrowserRouter>
  );
};

export default App;
