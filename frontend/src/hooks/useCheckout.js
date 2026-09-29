import { useState, useCallback, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const CHECKOUT_STEPS = [
  { id: 'delivery',  label: 'Delivery' },
  { id: 'address',   label: 'Address' },
  { id: 'payment',   label: 'Payment' },
  { id: 'review',    label: 'Review' },
];

const INITIAL_FORM = {
  // Delivery step
  fulfillmentType: 'delivery', // 'delivery' | 'pickup'
  // Address step
  name: '',
  email: '',
  phone: '',
  addressLine: '',
  city: '',
  pincode: '',
  // Payment step
  paymentMethod: 'upi', // 'upi' | 'card' | 'cod'
  // Optional extras
  couponCode: '',
  tipAmount: 0,
};

/**
 * Manages checkout step progression, form data, and order submission.
 *
 * @returns {object} Checkout state and handlers.
 */
export function useCheckout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const { cartItems, subtotal, deliveryFee, total, completeOrder } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Pre-fill form with authenticated user's info
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone || '',
      }));
    }
  }, [isAuthenticated, user]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < CHECKOUT_STEPS.length) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const nextStep = useCallback(() => goToStep(currentStep + 1), [currentStep, goToStep]);
  const prevStep = useCallback(() => goToStep(currentStep - 1), [currentStep, goToStep]);

  /**
   * Submits the order to the real backend API.
   * Transforms cart items → { productId, quantity } shape the backend expects.
   * Requires the user to be authenticated (backend enforces JWT).
   */
  const submitOrder = useCallback(async () => {
    if (cartItems.length === 0) return;

    // Guard: backend requires auth for order placement
    if (!isAuthenticated) {
      setOrderError('You need to be signed in to place an order. Please log in and try again.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      // Build full address string from form fields
      const addressText = formData.fulfillmentType === 'pickup'
        ? 'Farm Pickup — No delivery address'
        : [formData.addressLine, formData.city, formData.pincode].filter(Boolean).join(', ');

      // Transform cart items into backend-expected shape
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      // Map frontend payment method values to backend expected strings
      const paymentMethodMap = {
        upi: 'UPI',
        card: 'Card',
        cod: 'Cash on Delivery',
      };

      const orderPayload = {
        items: orderItems,
        addressText,
        paymentMethod: paymentMethodMap[formData.paymentMethod] || formData.paymentMethod,
        couponCode: formData.couponCode || undefined,
        tipAmount: Number(formData.tipAmount) || 0,
      };

      // Call real backend API
      const result = await orderService.placeOrder(orderPayload);

      // Backend returns { success: true, order: { orderId, totalAmount, ... } }
      const orderId = result?.orderId || result?.id || ('ORD-' + Math.floor(Math.random() * 9000 + 1000));

      completeOrder(orderId, {
        id: orderId,
        fulfillmentType: formData.fulfillmentType,
        deliveryFee: result?.deliveryFee ?? deliveryFee,
        subtotal: result?.subtotal ?? subtotal,
        total: result?.totalAmount ?? total,
        discountAmount: result?.discountAmount ?? 0,
        otpCode: result?.otpCode,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: addressText,
        paymentMethod: formData.paymentMethod,
        status: 'Pending',
      });
    } catch (err) {
      const message = err?.data?.message || err?.message || 'Could not process your order. Please try again.';
      setOrderError(message);
      console.error('[Checkout] Order submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    cartItems,
    isAuthenticated,
    completeOrder,
    formData,
    deliveryFee,
    subtotal,
    total,
  ]);

  return {
    steps: CHECKOUT_STEPS,
    currentStep,
    currentStepId: CHECKOUT_STEPS[currentStep]?.id,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === CHECKOUT_STEPS.length - 1,
    isSubmitting,
    orderError,
    submitOrder,
    // Order summary values
    cartItems,
    subtotal,
    deliveryFee,
    total,
  };
}

export default useCheckout;

