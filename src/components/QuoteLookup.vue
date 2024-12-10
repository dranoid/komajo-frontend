<template>
    <div>
        <form @submit.prevent="lookupQuote" class="flex gap-4 items-end">
            <div class="form-group">
                <label>Search Type</label>
                <select v-model="searchType" required>
                    <option value="id">ID</option>
                    <option value="reference">Reference</option>
                    <option value="quoteId">Quote ID</option>
                </select>
            </div>
            <div class="form-group">
                <label>Search Value</label>
                <input v-model="searchValue" required />
            </div>
            <button type="submit" class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isLoading">
                {{ isLoading ? 'Loading...' : 'Get Quote' }}
            </button>
        </form>

        <div v-if="quoteDetails" class="mt-4">
            <!-- Main Details -->
            <div class="grid grid-cols-2 gap-4 p-4 border rounded bg-gray-50">
                <div class="col-span-2">
                    <h3 class="text-lg font-bold mb-2">Quote Information</h3>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Quote ID</p>
                    <p class="font-medium">{{ quoteDetails.quoteId }}</p>
                </div>
                <div>
                    <p class="text-sm text-gray-600">Status</p>
                    <p class="font-medium">
                        <span class="capitalize px-2 py-1 rounded"
                            :class="quoteDetails.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                            {{ quoteDetails.status }}
                        </span>
                    </p>
                </div>

                <!-- Amount Details Section -->
                <div class="col-span-2">
                    <h4 class="text-md font-semibold mb-2">Amount Details</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600">Fiat Amount</p>
                            <p class="font-medium">{{ quoteDetails.amount }} {{ quoteDetails.fromAsset.toUpperCase() }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Settlement Amount</p>
                            <p class="font-medium">{{ quoteDetails.settlementAmount }} {{
                                quoteDetails.toCurrency.toUpperCase() }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">BTC Amount</p>
                            <p class="font-medium">{{ quoteDetails.btcAmount }} BTC</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">SAT Amount</p>
                            <p class="font-medium">{{ quoteDetails.satAmount }} sats</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Fees</p>
                            <p class="font-medium">{{ quoteDetails.fees }} {{ quoteDetails.fromAsset.toUpperCase() }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Exchange Rate</p>
                            <p class="font-medium">1 {{ quoteDetails.fromAsset.toUpperCase() }} =
                                {{ quoteDetails.exchangeRate.rate }} {{ quoteDetails.exchangeRate.currency.toUpperCase()
                                }}</p>
                        </div>
                    </div>
                </div>

                <!-- Transaction Details Section -->
                <div class="col-span-2 mt-4">
                    <h4 class="text-md font-semibold mb-2">Transaction Details</h4>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600">Blockchain</p>
                            <p class="font-medium capitalize">{{ quoteDetails.chain }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Source</p>
                            <p class="font-medium capitalize">{{ quoteDetails.source }}</p>
                        </div>
                        <div class="col-span-2">
                            <p class="text-sm text-gray-600">Deposit Address</p>
                            <p class="font-medium break-all">{{ quoteDetails.address }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Payment ETA</p>
                            <p class="font-medium">{{ quoteDetails.paymentETA }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Expiry</p>
                            <p class="font-medium">{{ formatDate(quoteDetails.expiry) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Beneficiary Details -->
                <div class="col-span-2 mt-4">
                    <h3 class="text-lg font-bold mb-2">Beneficiary Details</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <p class="text-sm text-gray-600">Country</p>
                            <p class="font-medium">{{ quoteDetails.beneficiary.country }}</p>
                        </div>
                        <div>
                            <p class="text-sm text-gray-600">Currency</p>
                            <p class="font-medium">{{ quoteDetails.beneficiary.currency }}</p>
                        </div>

                        <!-- Conditional rendering based on destination type and country -->
                        <template v-if="quoteDetails.beneficiary.destination.type === 'BANK'">
                            <!-- Australia Bank Details -->
                            <template v-if="quoteDetails.beneficiary.country === 'AU'">
                                <div>
                                    <p class="text-sm text-gray-600">BSB Number</p>
                                    <p class="font-medium">{{ quoteDetails.beneficiary.destination.BSBNumber }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Account Number</p>
                                    <p class="font-medium">{{ quoteDetails.beneficiary.destination.accountNumber }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Account Name</p>
                                    <p class="font-medium">{{ quoteDetails.beneficiary.destination.accountName }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Remittance Purpose</p>
                                    <p class="font-medium">{{
                                        formatRemittancePurpose(quoteDetails.beneficiary.destination.remittancePurpose)
                                    }}</p>
                                </div>
                            </template>

                            <!-- Nigeria Bank Details -->
                            <template v-if="quoteDetails.beneficiary.country === 'NG'">
                                <div>
                                    <p class="text-sm text-gray-600">Bank Code</p>
                                    <p class="font-medium">{{ quoteDetails.beneficiary.destination.bankCode }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-600">Account Number</p>
                                    <p class="font-medium">{{ quoteDetails.beneficiary.destination.accountNumber }}</p>
                                </div>
                            </template>
                        </template>

                        <!-- Kenya Mobile Money Details -->
                        <template
                            v-if="quoteDetails.beneficiary.destination.type === 'MOBILEMONEY' && quoteDetails.beneficiary.country === 'KE'">
                            <div>
                                <p class="text-sm text-gray-600">Network</p>
                                <p class="font-medium">{{ quoteDetails.beneficiary.destination.network }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Account Name</p>
                                <p class="font-medium">{{ quoteDetails.beneficiary.destination.accountName }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-600">Account Number</p>
                                <p class="font-medium">{{ quoteDetails.beneficiary.destination.accountNumber }}</p>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- Transaction Timeline -->
                <div class="col-span-2 mt-4">
                    <h3 class="text-lg font-bold mb-2">Transaction Timeline</h3>
                    <div class="space-y-2">
                        <div v-for="(timestamp, stage) in quoteDetails.trip" :key="stage"
                            class="flex justify-between items-center">
                            <span class="text-sm capitalize">{{ formatTimelineStage(stage) }}</span>
                            <span class="text-sm">{{ formatTimestamp(timestamp) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Notification v-model="showNotification" :type="notificationType" :title="notificationTitle"
        :message="notificationMessage" :timeout="5000" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getQuoteById, getQuoteByQuoteId, getQuoteByReference } from '../api/api';
import Notification from './Notification.vue';

interface BaseDestination {
    type: "BANK" | "MOBILEMONEY";
}

interface AustraliaBankDestination extends BaseDestination {
    type: "BANK";
    BSBNumber: string;
    accountName: string;
    accountNumber: string;
    remittancePurpose: "EXPORTED_GOODS" | "DELIVERY_FEES" | "TRAVEL" | "HOTEL_ACCOMMODATION" | "SERVICE_CHARGES" | "OFFICE_EXPENSES";
    beneficiary: {
        beneficiaryType: "BUSINESS" | "INDIVIDUAL";
        country: string;
        state: string;
        city: string;
        address: string;
        postCode: string;
    };
    sender: {
        type?: "BUSINESS" | "INDIVIDUAL";
        accountName: string;
        country: string;
        city: string;
        address: string;
        postCode: string;
        businessRegistrationNumber: string;
    };
}

interface NigeriaBankDestination extends BaseDestination {
    type: "BANK";
    bankCode: string;
    accountNumber: string;
}

interface KenyaMobileMoneyDestination extends BaseDestination {
    type: "MOBILEMONEY";
    network: "MPESA";
    accountName: string;
    accountNumber: string;
}

type Destination = AustraliaBankDestination | NigeriaBankDestination | KenyaMobileMoneyDestination;


interface Beneficiary {
    id: string;
    status: string;
    country: string;
    currency: string;
    createdAt: string;
    reference: string;
    updatedAt: string;
    destination: Destination;
}

interface ExchangeRate {
    rate: number;
    currency: string;
}

interface Trip {
    submitted: string;
    quoteSentAt: string;
    assetReceived: string;
    initializedAt: string;
    completionTime: string;
    processingStart: string;
    timeToCompletion: number;
}

interface QuoteDetails {
    id: string;
    quoteId: string;
    status: string;
    amount: string;
    satAmount: string;
    btcAmount: string;
    centAmount: string;
    settlementAmount: number;
    centFees: string;
    fees: string;
    address: string;
    source: string;
    fromAsset: string;
    chain: string;
    toCurrency: string;
    paymentETA: string;
    expiry: string;
    exchangeRate: {
        rate: number;
        currency: string;
    };
    beneficiary: Beneficiary;
    trip: Record<string, string>;
}

const isLoading = ref(false)
const searchType = ref<string>('quoteId')
const searchValue = ref<string>('')
const quoteDetails = ref<QuoteDetails | null>(null)
const showNotification = ref(false)
const notificationType = ref('')
const notificationTitle = ref('')
const notificationMessage = ref('')


const formatTimelineStage = (stage: string): string => {
    return stage
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase())
}

const formatTimestamp = (timestamp: string): string => {
    return new Date(parseInt(timestamp) * 1000).toLocaleString()
}

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString()
}

const formatRemittancePurpose = (purpose: string): string => {
    return purpose.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
}

const lookupQuote = async () => {
    isLoading.value = true
    try {
        let response;
        if (searchType.value === 'id') {
            response = await getQuoteById(searchValue.value);
        } else if (searchType.value === 'quoteId') {
            response = await getQuoteByQuoteId(searchValue.value);
        } else if (searchType.value === 'reference') {
            response = await getQuoteByReference(searchValue.value);
        }

        quoteDetails.value = response.data;
        showNotification.value = true
        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Quote details fetched successfully'
    } catch (error) {
        console.error('Error looking up quote:', error);
        showNotification.value = true
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = 'Error fetching quote details'
    } finally {
        isLoading.value = false
    }
}
</script>

<style scoped></style>