<template>
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white rounded-xl w-full max-w-2xl mx-4">
            <!-- Modal Header -->
            <div class="p-6 border-b border-gray-200">
                <div class="flex items-center justify-between">
                    <h2 class="text-xl font-semibold text-gray-900">Transaction Details</h2>
                    <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                <!-- Transaction Info -->
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500">Reference</p>
                        <p class="font-medium">{{ transaction.reference }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500">Status</p>
                        <span
                            :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`">
                            {{ formatStatus(transaction.status) }}
                        </span>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500">Created At</p>
                        <p class="font-medium">{{ formatDate(transaction.createdAt) }}</p>
                    </div>
                    <div class="space-y-1">
                        <p class="text-sm text-gray-500">Payment Reason</p>
                        <p class="font-medium">{{ transaction.paymentReason }}</p>
                    </div>
                </div>

                <!-- Amount Details -->
                <div class="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h3 class="font-medium text-gray-900">Amount Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Amount</p>
                            <p class="font-medium">{{ formatNumber(+transaction.amount) }} {{
                                transaction.fromAsset.toUpperCase() }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Settlement Amount</p>
                            <p class="font-medium">{{ formatNumber(transaction.settlementAmount) }} {{
                                transaction.toCurrency.toUpperCase() }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Exchange Rate</p>
                            <p class="font-medium">{{ formatNumber(transaction.exchangeRate.rate) }}</p>
                        </div>
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Fees</p>
                            <p class="font-medium">{{ formatNumber(+transaction.fees) }} {{
                                transaction.fromAsset.toUpperCase() }}</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Details -->
                <div class="bg-gray-50 p-4 rounded-lg space-y-4" v-if="transaction.address">
                    <h3 class="font-medium text-gray-900">Payment Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <p class="text-sm text-gray-500">Wallet address</p>
                            <p class="font-medium">{{ transaction.address }}</p>
                        </div>
                    </div>
                </div>


                <!-- Dynamic Beneficiary Details based on country -->
                <!-- Beneficiary Details -->
                <div class="bg-gray-50 p-4 rounded-lg space-y-4" v-if="transaction.beneficiary.destination">
                    <h3 class="font-medium text-gray-900">Beneficiary Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Nigeria Bank Details -->
                        <template
                            v-if="transaction.beneficiary.country === 'NG' && isNigerianBank(transaction.beneficiary.destination)">
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">Bank</p>
                                <p class="font-medium">{{
                                    getSanitizedBankCodes(transaction.beneficiary.destination.bankCode) }}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">Account Number</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.accountNumber }}</p>
                            </div>
                        </template>

                        <!-- Kenya Mobile Money Details -->
                        <template
                            v-if="transaction.beneficiary.country === 'KE' && isKenyanBank(transaction.beneficiary.destination)">
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">M-Pesa Number</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.accountNumber }}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">Account Name</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.accountName }}</p>
                            </div>
                        </template>

                        <!-- Australia Bank Details -->
                        <template
                            v-if="transaction.beneficiary.country === 'AU' && isAustralianBank(transaction.beneficiary.destination)">
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">BSB Number</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.BSBNumber }}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">Account Number</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.accountNumber }}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">Account Name</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.accountName }}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm text-gray-500">Remittance Purpose</p>
                                <p class="font-medium">{{ transaction.beneficiary.destination.remittancePurpose }}</p>
                            </div>

                            <!-- Australian Beneficiary Information -->
                            <div class="col-span-2 mt-4">
                                <h4 class="font-medium text-gray-900 mb-4">Beneficiary Information</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Type</p>
                                        <p class="font-medium">{{
                                            transaction.beneficiary.destination.beneficiary.beneficiaryType }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Country</p>
                                        <p class="font-medium">{{
                                            transaction.beneficiary.destination.beneficiary.country }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">State</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.beneficiary.state
                                            }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">City</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.beneficiary.city
                                            }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Address</p>
                                        <p class="font-medium">{{
                                            transaction.beneficiary.destination.beneficiary.address }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Post Code</p>
                                        <p class="font-medium">{{
                                            transaction.beneficiary.destination.beneficiary.postCode }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Australian Sender Information -->
                            <div class="col-span-2 mt-4">
                                <h4 class="font-medium text-gray-900 mb-4">Sender Information</h4>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Type</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.sender.type }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Account Name</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.sender.accountName
                                            }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Country</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.sender.country }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">City</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.sender.city }}</p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Address</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.sender.address }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Post Code</p>
                                        <p class="font-medium">{{ transaction.beneficiary.destination.sender.postCode }}
                                        </p>
                                    </div>
                                    <div class="space-y-1">
                                        <p class="text-sm text-gray-500">Business Registration Number</p>
                                        <p class="font-medium">{{
                                            transaction.beneficiary.destination.sender.businessRegistrationNumber }}</p>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { AustraliaBankDto, KenyaMobileMoneyDto, NigeriaBankDto, Transaction } from '../api/api.interface';


defineProps<{
    transaction: Transaction
}>();

defineEmits<{
    (e: 'close'): void
}>();

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const formatStatus = (status: string) => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending_address_deposit':
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'quote':
            return 'bg-gray-100 text-gray-800';
        case 'underpayment':
        case 'failed':
            return 'bg-red-100 text-red-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'initiated':
            return 'bg-yellow-100 text-yellow-800';
        case 'success':
            return 'bg-green-100 text-green-800';
        case 'expired':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

function isAustralianBank(beneficiary: any): beneficiary is AustraliaBankDto {
    return beneficiary?.type === 'BANK' && 'BSBNumber' in beneficiary;
}
function isNigerianBank(destination: any): destination is NigeriaBankDto {
    return destination?.type === 'BANK' && 'bankCode' in destination;
}

function isKenyanBank(beneficiary: any): beneficiary is KenyaMobileMoneyDto {
    return beneficiary.type === 'MOBILEMONEY'
}

const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

// New function to fetch and sanitize bank codes from local storage
const getSanitizedBankCodes = (code: string) => {
    const storedJsonBankCodes = localStorage.getItem('nigeriaBankCodes') || '[]'

    const storedBankCodes = JSON.parse(storedJsonBankCodes);
    const bank = storedBankCodes.find((bank: any) => bank.value === code);
    return bank?.bankName;
}

</script>