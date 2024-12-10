<template>
    <div class="relative">
        <div class="tabs">
            <button v-for="(tab, index) in tabs" :key="tab.id" :class="['tab', { active: currentTab === index }]"
                @click="currentTab = index">
                {{ tab.label }}
            </button>
        </div>

        <Transition mode="out-in" enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1">

            <div :key="currentTab" :id="`tab-panel-${tabs[currentTab].id}`" role="tabpanel" class="tab-content mt-4">
                <!-- Create Payout Quote Form -->
                <div v-if="currentTab === 0">
                    <form @submit.prevent="submitCreateQuote">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label>Source</label>
                                <select v-model="createQuoteForm.source" required>
                                    <option value="onchain">On-chain</option>
                                    <option value="offchain">Off-chain</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>From Asset</label>
                                <select v-model="createQuoteForm.fromAsset" required>
                                    <option value="usdt">USDT</option>
                                    <option value="usdc">USDC</option>
                                    <option value="btc">BTC</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>ToCurrency</label>
                                <select v-model="createQuoteForm.toCurrency" required>
                                    <option value="ngn">NGN</option>
                                    <option value="kes">KES</option>
                                    <option value="aud">AUD</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Chain</label>
                                <select v-model="createQuoteForm.chain" required>
                                    <option value="lightning">Lightning</option>
                                    <option value="mainnet">Mainnet</option>
                                    <option value="trc20">TRC20</option>
                                    <option value="erc20">ERC20</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Amount</label>
                                <input v-model.number="createQuoteForm.amount" type="number"
                                    :required="!createQuoteForm.settlementAmount" />
                            </div>
                            <div class="form-group">
                                <label>Settlement Amount</label>
                                <input v-model.number="createQuoteForm.settlementAmount" type="number"
                                    :required="!createQuoteForm.amount" />
                            </div>
                        </div>
                        <div class="mt-4 flex gap-4">
                            <button type="submit" class="btn-primary" :disabled="loadingCreateQuote">
                                {{ loadingCreateQuote ? 'Submitting...' : 'Submit' }}
                            </button>
                            <button type="button" @click="clearCreateQuoteForm" class="btn-secondary"
                                :disabled="loadingCreateQuote">
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Initialize Payout Quote Form -->
                <div v-if="currentTab === 1">
                    <form @submit.prevent="submitInitializeQuote">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="form-group">
                                <label>Quote ID</label>
                                <input v-model="initializeQuoteForm.quoteId" required />
                            </div>
                            <div class="form-group">
                                <label>Customer ID</label>
                                <input v-model="initializeQuoteForm.customerId" required />
                            </div>
                            <div class="form-group">
                                <label>Reference</label>
                                <input v-model="initializeQuoteForm.reference" required />
                            </div>
                            <div class="form-group">
                                <label>Payment Reason</label>
                                <input v-model="initializeQuoteForm.paymentReason" required />
                            </div>
                            <div class="form-group">
                                <label>Callback URL</label>
                                <input v-model="initializeQuoteForm.callbackUrl" />
                            </div>
                            <div class="form-group">
                                <label>Country</label>
                                <select v-model="initializeQuoteForm.country" required
                                    @change="updateBeneficiaryFields">
                                    <option value="australia">Australia</option>
                                    <option value="nigeria">Nigeria</option>
                                    <option value="kenya">Kenya</option>
                                </select>
                            </div>

                            <!-- Dynamic Beneficiary Fields -->
                            <template v-if="initializeQuoteForm.country === 'australia'">
                                <!-- Australia Bank Fields -->
                                <div class="col-span-2 grid grid-cols-2 gap-4">
                                    <div class="form-group">
                                        <label>BSB Number</label>
                                        <input v-model="australiaBeneficiary.BSBNumber" pattern="^\d{6}$" required />
                                    </div>
                                    <div class="form-group">
                                        <label>Account Number</label>
                                        <input v-model="australiaBeneficiary.accountNumber" pattern="^\d{9}$"
                                            required />
                                    </div>
                                    <div class="form-group">
                                        <label>Account Name</label>
                                        <input v-model="australiaBeneficiary.accountName" required />
                                    </div>
                                    <div class="form-group">
                                        <label>Remittance Purpose</label>
                                        <select v-model="australiaBeneficiary.remittancePurpose" required>
                                            <option value="EXPORTED_GOODS">Exported Goods</option>
                                            <option value="DELIVERY_FEES">Delivery Fees</option>
                                            <option value="TRAVEL">Travel</option>
                                            <option value="HOTEL_ACCOMMODATION">Hotel Accommodation</option>
                                            <option value="SERVICE_CHARGES">Service Charges</option>
                                            <option value="OFFICE_EXPENSES">Office Expenses</option>
                                        </select>
                                    </div>
                                    <div class="col-span-2">
                                        <h4 class="font-medium mb-2">Beneficiary Details</h4>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="form-group">
                                                <label>Type</label>
                                                <select v-model="australiaBeneficiary.beneficiary.beneficiaryType"
                                                    required>
                                                    <option value="BUSINESS">Business</option>
                                                    <option value="INDIVIDUAL">Individual</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Country</label>
                                                <input v-model="australiaBeneficiary.beneficiary.country" required />
                                            </div>
                                            <div class="form-group">
                                                <label>State</label>
                                                <input v-model="australiaBeneficiary.beneficiary.state" required />
                                            </div>
                                            <div class="form-group">
                                                <label>City</label>
                                                <input v-model="australiaBeneficiary.beneficiary.city" required />
                                            </div>
                                            <div class="form-group">
                                                <label>Address</label>
                                                <input v-model="australiaBeneficiary.beneficiary.address" required />
                                            </div>
                                            <div class="form-group">
                                                <label>Post Code</label>
                                                <input v-model="australiaBeneficiary.beneficiary.postCode" required />
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-span-2">
                                        <h4 class="font-medium mb-2">Sender Details</h4>
                                        <div class="grid grid-cols-2 gap-4">
                                            <div class="form-group">
                                                <label>Type</label>
                                                <select v-model="australiaBeneficiary.sender.type" required>
                                                    <option value="BUSINESS">Business</option>
                                                    <option value="INDIVIDUAL">Individual</option>
                                                </select>
                                            </div>
                                            <div class="form-group">
                                                <label>Account Name</label>
                                                <input v-model="australiaBeneficiary.sender.accountName" required />
                                            </div>
                                            <div class="form-group">
                                                <label>Country</label>
                                                <input v-model="australiaBeneficiary.sender.country" required />
                                            </div>
                                            <div class="form-group">
                                                <label>City</label>
                                                <input v-model="australiaBeneficiary.sender.city" required />
                                            </div>
                                            <div class="form-group">
                                                <label>Address</label>
                                                <input v-model="australiaBeneficiary.sender.address" required />
                                            </div>
                                            <div class="form-group">
                                                <label>Post Code</label>
                                                <input v-model="australiaBeneficiary.sender.postCode" required />
                                            </div>
                                            <div class="form-group">
                                                <label>Business Registration Number</label>
                                                <input v-model="australiaBeneficiary.sender.businessRegistrationNumber"
                                                    required />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>

                            <template v-if="initializeQuoteForm.country === 'nigeria'">
                                <!-- Nigeria Bank Fields -->
                                <div class="col-span-2 grid grid-cols-2 gap-4">
                                    <div class="form-group">
                                        <label>Bank Code</label>
                                        <select v-model="nigeriaBeneficiary.bankCode" required>
                                            <option v-for="bank in nigeriaBankCodes" :key="bank.value"
                                                :value="bank.value">
                                                {{ bank.name }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Account Number</label>
                                        <input v-model="nigeriaBeneficiary.accountNumber" required />
                                    </div>
                                </div>
                            </template>

                            <template v-if="initializeQuoteForm.country === 'kenya'">
                                <!-- Kenya Mobile Money Fields -->
                                <div class="col-span-2 grid grid-cols-2 gap-4">
                                    <div class="form-group">
                                        <label>Network</label>
                                        <select v-model="kenyaBeneficiary.network" required>
                                            <option value="MPESA">MPESA</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label>Account Name</label>
                                        <input v-model="kenyaBeneficiary.accountName" required />
                                    </div>
                                    <div class="form-group">
                                        <label>Account Number</label>
                                        <input v-model="kenyaBeneficiary.accountNumber" required />
                                    </div>
                                </div>
                            </template>
                        </div>
                        <div class="mt-4 flex gap-4">
                            <button type="submit" class="btn-primary" :disabled="loadingInitializeQuote">
                                {{ loadingInitializeQuote ? 'Submitting...' : 'Submit' }}
                            </button>
                            <button type="button" @click="clearInitializeQuoteForm" class="btn-secondary"
                                :disabled="loadingInitializeQuote">
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Finalize Quote Form -->
                <div v-if="currentTab === 2">
                    <form @submit.prevent="submitFinalizeQuote" class="max-w-md">
                        <div class="form-group">
                            <label>Quote ID</label>
                            <input v-model="finalizeQuoteForm.quoteId" required placeholder="Enter quote ID to finalize"
                                class="w-full" />
                        </div>
                        <div class="mt-4 flex gap-4">
                            <button type="submit" class="btn-primary" :disabled="loadingFinalizeQuote">
                                {{ loadingFinalizeQuote ? 'Finalizing...' : 'Finalize Quote' }}
                            </button>
                            <button type="button" @click="clearFinalizeQuoteForm" class="btn-secondary"
                                :disabled="loadingFinalizeQuote">
                                Clear Form
                            </button>
                        </div>
                    </form>
                </div>

            </div>

        </Transition>

        <!-- Side Panel -->
        <Transition enter-active-class="transform transition ease-in-out duration-300"
            enter-from-class="translate-x-full" enter-to-class="translate-x-0"
            leave-active-class="transform transition ease-in-out duration-300" leave-from-class="translate-x-0"
            leave-to-class="translate-x-full">
            <div v-if="showQuotePanel" class="fixed inset-y-0 right-0 w-96 bg-white shadow-lg border-l overflow-y-auto">
                <div class="p-4">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold">Quote Details</h3>
                        <button @click="showQuotePanel = false" class="text-gray-500 hover:text-gray-700">
                            <span class="sr-only">Close panel</span>
                            ✕
                        </button>
                    </div>

                    <div v-if="quoteResponse && panelToShow === 'create'" class="space-y-4">
                        <!-- Status and Message -->
                        <div class="bg-green-50 p-4 rounded-md">
                            <p class="text-green-700 font-medium">{{ quoteResponse.message }}</p>
                        </div>

                        <!-- Quote Details -->
                        <div class="space-y-3">
                            <div class="bg-blue-50 p-4 rounded-md">
                                <p class="text-blue-700">{{ quoteResponse.data.quoteText }}</p>
                                <p class="text-blue-600 text-sm mt-1">{{ quoteResponse.data.expiresInText }}</p>
                            </div>

                            <div class="border rounded-md divide-y">
                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Quote ID</span>
                                    <span class="font-medium">{{ quoteResponse.data.quoteId }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Amount</span>
                                    <span class="font-medium">{{ quoteResponse.data.amount }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Settlement Amount</span>
                                    <span class="font-medium">{{
                                        quoteResponse.data.settlementAmount.toLocaleString() }}
                                        {{ quoteResponse.data.settlementCurrency }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Exchange Rate</span>
                                    <span class="font-medium">{{ quoteResponse.data.exchangeRate }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Status</span>
                                    <span class="font-medium capitalize">{{ quoteResponse.data.status }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 mt-6">
                            <button @click="moveToInitialize"
                                class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Initialize Quote
                            </button>
                            <button @click="copyQuoteId" class="px-4 py-2 border rounded hover:bg-gray-50">
                                Copy Quote ID
                            </button>
                        </div>
                    </div>
                    <div v-if="finalizeQuoteResponse && panelToShow === 'finalize'" class="space-y-4">
                        <!-- Status and Message -->
                        <div class="bg-green-50 p-4 rounded-md">
                            <p class="text-green-700 font-medium">{{ finalizeQuoteResponse.message }}</p>
                        </div>

                        <!-- Quote Details -->
                        <div class="space-y-3">
                            <div class="border rounded-md divide-y">
                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Quote ID</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.quoteId }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Amount</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.amount }} {{
                                        finalizeQuoteResponse.data.fromAsset }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Settlement Amount</span>
                                    <span class="font-medium">{{
                                        finalizeQuoteResponse.data.settlementAmount.toLocaleString() }}
                                        {{ finalizeQuoteResponse.data.settlementCurrency }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Exchange Rate</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.exchangeRate }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Chain</span>
                                    <span class="font-medium capitalize">{{ finalizeQuoteResponse.data.chain }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Payment ETA</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.paymentETA }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Fees</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.fees }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Status</span>
                                    <span class="font-medium capitalize">{{ finalizeQuoteResponse.data.status }}</span>
                                </div>

                                <div class="flex flex-col p-3">
                                    <span class="text-gray-600 mb-1">Deposit Address</span>
                                    <span class="font-medium break-all">{{ finalizeQuoteResponse.data.address }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Reference</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.reference }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Payment Reason</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.paymentReason }}</span>
                                </div>

                                <div class="flex justify-between p-3">
                                    <span class="text-gray-600">Expires In</span>
                                    <span class="font-medium">{{ finalizeQuoteResponse.data.expiresInText }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex gap-3 mt-6">
                            <button @click="copyWalletAddress"
                                class="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Copy Address
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
    <Notification v-model="showNotification" :type="notificationType" :title="notificationTitle"
        :message="notificationMessage" :timeout="5000" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { finalizeOfframpsQuote, getOfframpsQuote, getWithdrawalRequirements, initializeOfframpsQuote } from '../api/api'
import { AustraliaBankDto, CreatePayoutQuoteDto, FinalizeQuoteDto, KenyaMobileMoneyDto, NigeriaBankDto } from '../api/api.interface'
import Notification from './Notification.vue'

const currentTab = ref(0)
const tabs = [
    { id: 'create', label: 'Create Quote' },
    { id: 'initialize', label: 'Initialize Quote' },
    { id: 'complete', label: 'Finalize Quote' }
]

interface QuoteResponse {
    status: boolean
    message: string
    data: {
        id: string
        status: string
        settlementCurrency: string
        exchangeRate: number
        quoteId: string
        settlementAmount: number
        amount: number
        expiryTimeStamp: number
        expiresInText: string
        quoteText: string
    }
}
interface FinalizeQuoteResponse {
    status: boolean;
    message: string;
    data: {
        id: string;
        fees: number;
        chain: string;
        amount: number;
        status: string;
        address: string;
        quoteId: string;
        fromAsset: string;
        reference: string;
        paymentETA: string;
        exchangeRate: number;
        expiresInText: string;
        paymentReason: string;
        expiryTimeStamp: number;
        settlementAmount: number;
        beneficiaryDetails: Record<string, any>;
        settlementCurrency: string;
    };
}

const nigeriaBankCodes = ref([])

const panelToShow = ref("create")
const showQuotePanel = ref(false)
const quoteResponse = ref<QuoteResponse | null>(null)
const finalizeQuoteResponse = ref<FinalizeQuoteResponse | null>(null)

const loadingCreateQuote = ref(false)
const loadingInitializeQuote = ref(false)
const loadingFinalizeQuote = ref(false)

const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

const createQuoteForm = reactive<CreatePayoutQuoteDto>({
    source: "onchain",
    fromAsset: "",
    toCurrency: "",
    chain: "",
    amount: undefined,
    settlementAmount: undefined
})

const initializeQuoteForm = reactive({
    quoteId: "",
    customerId: "",
    country: "",
    reference: "",
    paymentReason: "",
    callbackUrl: "",
    beneficiary: null as AustraliaBankDto | NigeriaBankDto | KenyaMobileMoneyDto | null,
    clientMetaData: {
    }
})

const finalizeQuoteForm = reactive<FinalizeQuoteDto>({
    quoteId: ""
})

const australiaBeneficiary = reactive<AustraliaBankDto>({
    type: "BANK",
    BSBNumber: "",
    accountName: "",
    accountNumber: "",
    remittancePurpose: "SERVICE_CHARGES",
    beneficiary: {
        beneficiaryType: "INDIVIDUAL",
        country: "",
        state: "",
        city: "",
        address: "",
        postCode: ""
    },
    sender: {
        type: "BUSINESS",
        accountName: "",
        country: "",
        city: "",
        address: "",
        postCode: "",
        businessRegistrationNumber: ""
    }
})

const nigeriaBeneficiary = reactive<NigeriaBankDto>({
    type: "BANK",
    bankCode: "",
    accountNumber: ""
})

const kenyaBeneficiary = reactive<KenyaMobileMoneyDto>({
    type: "MOBILEMONEY",
    network: "MPESA",
    accountName: "",
    accountNumber: ""
})

const updateBeneficiaryFields = () => {
    switch (initializeQuoteForm.country) {
        case 'australia':
            initializeQuoteForm.beneficiary = australiaBeneficiary
            break
        case 'nigeria':
            initializeQuoteForm.beneficiary = nigeriaBeneficiary
            fetchNigeriaBankCodes()
            break
        case 'kenya':
            initializeQuoteForm.beneficiary = kenyaBeneficiary
            break
    }
}

const submitCreateQuote = async () => {
    loadingCreateQuote.value = true
    try {
        const response = await getOfframpsQuote(createQuoteForm)

        quoteResponse.value = response

        showQuotePanel.value = true
        panelToShow.value = "create"

        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Quote created successfully'
        showNotification.value = true
    } catch (error) {
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = 'Failed to create quote'
        showNotification.value = true
        console.error('Error creating quote:', error)
    } finally {
        loadingCreateQuote.value = false
    }
}

const submitInitializeQuote = async () => {
    loadingInitializeQuote.value = true
    try {
        initializeQuoteForm.country = sanitizeCountryName(initializeQuoteForm.country)
        const response = await initializeOfframpsQuote(initializeQuoteForm)
        console.log(response)

        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Quote initialized successfully'
        showNotification.value = true
    } catch (error) {
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = 'Failed to initialize quote'
        showNotification.value = true
        console.log(initializeQuoteForm)
        console.error('Error initializing quote:', error)
    } finally {
        loadingInitializeQuote.value = false
    }
}

const submitFinalizeQuote = async () => {
    loadingFinalizeQuote.value = true
    try {
        // Add your API call here
        // const response = await api.finalizeQuote(finalizeQuoteForm.quoteId)
        const response = await finalizeOfframpsQuote(finalizeQuoteForm)

        // Simulated response for demonstration


        finalizeQuoteResponse.value = response

        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Quote finalized successfully'
        showNotification.value = true

        showQuotePanel.value = true
        panelToShow.value = "finalize"
        // Handle success
    } catch (error) {
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = 'Failed to finalize quote'
        showNotification.value = true
        console.error('Error finalizing quote:', error)
    } finally {
        loadingFinalizeQuote.value = false
    }
}

const fetchNigeriaBankCodes = async () => {
    try {
        const response = await getWithdrawalRequirements("NG")
        nigeriaBankCodes.value = transformBankData(response)
    } catch (error) {
        console.error('Error fetching Nigeria bank codes:', error)
    }
}

const moveToInitialize = () => {
    currentTab.value = 1
    if (quoteResponse.value) {
        initializeQuoteForm.quoteId = quoteResponse.value.data.quoteId
        initializeQuoteForm
    }
    showQuotePanel.value = false
}

const copyToClipboard = async (text: string, successTitle: string, successMessage: string) => {
    try {
        console.log('Attempting to copy:', text);

        if (navigator.clipboard && window.isSecureContext) {
            console.log('Using modern Clipboard API');
            await navigator.clipboard.writeText(text);
        } else {
            console.log('Using fallback method');
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed'; // Prevent scrolling to the bottom of the page
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }

        // Show success notification
        console.log('Text copied successfully');
        showNotification.value = true;
        notificationType.value = 'success';
        notificationTitle.value = successTitle;
        notificationMessage.value = successMessage;
    } catch (err) {
        // Show error notification
        console.error('Copy failed:', err);
        showNotification.value = true;
        notificationType.value = 'error';
        notificationTitle.value = 'Copy Failed';
        notificationMessage.value = 'Unable to copy to clipboard';
    }
};


const copyQuoteId = async () => {
    if (quoteResponse.value?.data?.quoteId) {
        await copyToClipboard(
            quoteResponse.value.data.quoteId,
            'Quote ID Copied',
            'The quote ID has been copied to your clipboard'
        );
    }
};

const copyWalletAddress = async () => {
    console.log(finalizeQuoteResponse.value?.data?.address)
    if (finalizeQuoteResponse.value?.data?.address) {
        await copyToClipboard(
            finalizeQuoteResponse.value.data.address,
            'Wallet Address Copied',
            'The wallet address has been copied to your clipboard'
        );
    }
};

const clearCreateQuoteForm = () => {
    Object.assign(createQuoteForm, {
        source: "onchain",
        fromAsset: "",
        toCurrency: "",
        chain: "",
        amount: undefined,
        settlementAmount: undefined
    })
}

const clearInitializeQuoteForm = () => {
    Object.assign(initializeQuoteForm, {
        quoteId: "",
        customerId: "",
        country: "",
        reference: "",
        paymentReason: "",
        callbackUrl: "",
        beneficiary: null,
        clientMetaData: {
        }
    })
    // Clear beneficiary forms
    Object.assign(australiaBeneficiary, {
        type: "BANK",
        BSBNumber: "",
        accountName: "",
        accountNumber: "",
        remittancePurpose: "SERVICE_CHARGES",
        beneficiary: {
            beneficiaryType: "INDIVIDUAL",
            country: "",
            state: "",
            city: "",
            address: "",
            postCode: ""
        },
        sender: {
            type: "BUSINESS",
            accountName: "",
            country: "",
            city: "",
            address: "",
            postCode: "",
            businessRegistrationNumber: ""
        }
    })
    Object.assign(nigeriaBeneficiary, { type: "BANK", bankCode: "", accountNumber: "" })
    Object.assign(kenyaBeneficiary, { type: "MOBILEMONEY", network: "MPESA", accountName: "", accountNumber: "" })
}
const clearFinalizeQuoteForm = () => {
    finalizeQuoteForm.quoteId = ""
}

function transformBankData(data) {
    // Navigate to the array of banks within the JSON structure
    const banks = data?.data?.destination?.BANK?.find(field => field.name === "bankCode")?.banks || [];

    // Transform the array into the desired format
    return banks.map(bank => ({
        name: `${bank.bankName} (${bank.bankCode})`,
        value: bank.bankCode
    }));
}

function sanitizeCountryName(country: string): string {
    const countryMap: Record<string, string> = {
        'nigeria': 'NG',
        'australia': 'AU',
        'kenya': 'KE'
    };
    return countryMap[country.toLowerCase()] || country;
}
</script>

<style lang="postcss">
.form-group {
    @apply flex flex-col gap-1;
}

.form-group label {
    @apply text-sm font-medium;
}

.form-group input,
.form-group select {
    @apply px-3 py-2 border rounded;
}

.btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600;
}

.btn-secondary {
    @apply px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300;
}

.tabs {
    @apply flex gap-4 border-b;
}

.tab {
    @apply px-4 py-2 hover:bg-gray-100;
}

.tab.active {
    @apply border-b-2 border-blue-500;
}

.btn-primary:disabled,
.btn-secondary:disabled {
    @apply bg-gray-400 cursor-not-allowed;
}
</style>