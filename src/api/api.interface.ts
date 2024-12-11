export interface CreatePayoutQuoteDto {
  source: "onchain" | "offchain";
  fromAsset: string;
  toCurrency: string;
  chain: string;
  amount?: number;
  settlementAmount?: number;
}

export interface InitializePayoutQuoteDto {
  quoteId: string;
  customerId: string;
  country: string;
  reference: string;
  beneficiaryId?: string;
  beneficiary?: NigeriaBankDto | KenyaMobileMoneyDto | AustraliaBankDto;
  paymentReason: string;
  callbackUrl?: string;
  clientMetaData?: Record<string, any>;
}

export interface FinalizeQuoteDto {
  quoteId: string;
}

export interface PayoutDto {
  address: string;
  amount: number;
}

// Beneficiary DTOs
// Australia DTO
export interface AustraliaBankDto {
  type: "BANK";
  BSBNumber: string; // Must match pattern: ^\d{6}$ (e.g. 123456)
  accountName: string;
  accountNumber: string; // Must match pattern: ^\d{9}$ (e.g. 123456789)
  remittancePurpose:
    | "EXPORTED_GOODS"
    | "DELIVERY_FEES"
    | "TRAVEL"
    | "HOTEL_ACCOMMODATION"
    | "SERVICE_CHARGES"
    | "OFFICE_EXPENSES";
  beneficiary: {
    beneficiaryType: "BUSINESS" | "INDIVIDUAL";
    country: string;
    state: string;
    city: string;
    address: string;
    postCode: string;
  };
  sender: {
    type?: "BUSINESS" | "INDIVIDUAL"; // Defaults to 'BUSINESS'
    accountName: string;
    country: string;
    city: string;
    address: string;
    postCode: string;
    businessRegistrationNumber: string;
  };
}

// Nigeria DTO
export interface NigeriaBankDto {
  type: "BANK";
  bankCode: string; // Must match one of the predefined bank codes
  accountNumber: string;
}

export interface NigerianBank {
  bankCode: string;
  bankName: string;
}

// Kenya DTO
export interface KenyaMobileMoneyDto {
  type: "MOBILEMONEY";
  network: "MPESA";
  accountName: string;
  accountNumber: string;
}

export interface SingleTransactionDto {
  toCurrency: string;
  amount: number;
  paymentReason: string;
  country: string;
  beneficiary: NigeriaBankDto | KenyaMobileMoneyDto | AustraliaBankDto;
}
