import axios from "axios";
import {
  ConfirmTransactionDto,
  CreatePayoutQuoteDto,
  InitializePayoutQuoteDto,
  PayoutDto,
  SingleTransactionDto,
} from "./api.interface";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create a configured axios instance
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getWithdrawalRequirements = async (countryCode: string) => {
  const response = await api.get(
    `/transaction/withdrawal-requirements/${countryCode}`
  );
  return response.data;
};

export const getRates = async () => {
  const response = await api.get("/transaction/rates");
  return response.data;
};

export const getQuoteByQuoteId = async (quoteId: string) => {
  const response = await api.get(`/transaction/quote/${quoteId}`);
  return response.data;
};

export const getQuoteByReference = async (reference: string) => {
  const response = await api.get(`/transaction/quote/reference/${reference}`);
  return response.data;
};

export const getQuoteById = async (id: string) => {
  const response = await api.get(`/transaction/quote/${id}`);
  return response.data;
};

export const getOfframpsQuote = async (
  createPayoutQuoteDto: CreatePayoutQuoteDto
) => {
  const response = await api.post(
    "/transaction/payouts/quote",
    createPayoutQuoteDto
  );
  return response.data;
};

export const initializeOfframpsQuote = async (
  initializePayoutQuoteDto: InitializePayoutQuoteDto
) => {
  const response = await api.post(
    "/transaction/payouts/initialize",
    initializePayoutQuoteDto
  );
  return response.data;
};

export const finalizeOfframpsQuote = async (finalizeObj: {
  quoteId: string;
}) => {
  const response = await api.post("/transaction/payouts/finalize", finalizeObj);
  return response.data;
};

export const confirmTransaction = async (
  confirmTransactionDto: ConfirmTransactionDto
) => {
  const response = await api.post(
    "/transaction/payouts/confirm",
    confirmTransactionDto
  );
  return response.data;
};

export const sendUSDTToWallet = async (payoutDto: PayoutDto) => {
  const response = await api.post("/transaction/send-usdt", payoutDto);
  return response.data;
};

export const getSupportedCountries = async () => {
  const response = await api.get("/transaction/supported-countries");
  return response.data;
};

export const singleTransaction = async (
  singleTransactionDto: SingleTransactionDto
) => {
  const response = await api.post(
    "/transaction/single-transaction",
    singleTransactionDto
  );
  return response.data;
};

export const getAllQuotes = async (page: number) => {
  if (!page) page = 1;
  const response = await api.get(`/transaction?page=${page}`);
  return response.data;
};

export default api;
