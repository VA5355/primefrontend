/*The useVirtualAccountContext Hook
This hook bridges the UI credentials (vId, vPass, salt) to the Redux/API layer.

TypeScript */
import { useDispatch, useSelector } from 'react-redux';
import { activateVirtualAccount } from '../slices/virtualAccountSliceOnedinaarVirtualAccount';
import { selectPaymentData } from '../slices/paymentSlice';

export const useVirtualAccountContext = () => {
  const dispatch = useDispatch();
  const { order } = useSelector(selectPaymentData);

  const confirmActivation = async (credentials: { vId: string, vPass: string, salt: string }) => {
    if (!order) return { success: false, message: "No payment order found" };

    const payload = {
      name: "OneDinaar Trader",
      email: credentials.vId, // Mapping Virtual ID to the email field
      password: credentials.vPass,
      userSalt: credentials.salt,
      underlyingOrderId: order.id
    };

    try {
      const resultAction = await dispatch(activateVirtualAccount(payload) as any);
      if (activateVirtualAccount.fulfilled.match(resultAction)) {
        return { success: true, data: resultAction.payload };
      } else {
        return { success: false, error: resultAction.payload };
      }
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return { confirmActivation };
};