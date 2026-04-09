import { instance } from "@services/instance";

export interface PaymentConfirmRequest {
  table_usage_id: number;
}

export interface PaymentConfirmResponse {
  message: string;
  data: {
    cart: {
      id: number;
      table_usage_id: number;
      status: string;
      pending_expires_at: string | null;
      round: number;
    };
  };
}

// pending cart → ordered
export const paymentConfirmApi = async (
  body: PaymentConfirmRequest
): Promise<PaymentConfirmResponse> => {
  // NOTE: credentials(include)는 axios instance(withCredentials)로 자동 처리
  // Endpoint spec: /api/v3/django/cart/payment-confirm/
  const res = await instance.post(`/api/v3/django/cart/payment-confirm/`, body);
  return res.data;
};

