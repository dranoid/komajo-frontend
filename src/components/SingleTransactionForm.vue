<template>
    <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
            <!-- Currency and Amount Section -->
            <div class="form-group">
                <label>Amount</label>
                <input v-model.number="form.amount" type="number" required />
            </div>
            <div class="form-group">
                <label>ToCurrency</label>
                <select v-model="form.toCurrency" required>
                    <option value="ngn">NGN</option>
                    <option value="kes">KES</option>
                    <option value="aud">AUD</option>
                </select>
            </div>
            <div class="form-group">
                <label>Payment Reason</label>
                <input v-model="form.paymentReason" required />
            </div>
            <div class="form-group">
                <label>Country</label>
                <select v-model="form.country" required @change="updateBeneficiaryFields">
                    <option value="australia">Australia</option>
                    <option value="nigeria">Nigeria</option>
                    <option value="kenya">Kenya</option>
                </select>
            </div>
        </div>

        <!-- Dynamic Beneficiary Fields -->
        <template v-if="form.country === 'australia'">
            <!-- Australia Bank Fields -->
            <div class="col-span-2 grid grid-cols-2 gap-4">
                <div class="form-group">
                    <label>BSB Number</label>
                    <input v-model="australiaBeneficiary.BSBNumber" pattern="^\d{6}$" required />
                </div>
                <div class="form-group">
                    <label>Account Number</label>
                    <input v-model="australiaBeneficiary.accountNumber" pattern="^\d{9}$" required />
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
                            <select v-model="australiaBeneficiary.beneficiary.beneficiaryType" required>
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
                            <input v-model="australiaBeneficiary.sender.businessRegistrationNumber" required />
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template v-if="form.country === 'nigeria'">
            <!-- Nigeria Bank Fields -->
            <div class="col-span-2 grid grid-cols-2 gap-4">
                <div class="form-group">
                    <label>Bank Code</label>
                    <select v-model="nigeriaBeneficiary.bankCode" required>
                        <option v-for="bank in nigeriaBankCodes" :key="bank.value" :value="bank.value">
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

        <template v-if="form.country === 'kenya'">
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

        <div class="flex gap-4">
            <button type="submit" class="btn-primary" :disabled="isLoading">
                {{ isLoading ? 'Processing...' : 'Submit' }}
            </button>
            <button type="button" @click="clearForm" class="btn-secondary" :disabled="isLoading">
                Clear Form
            </button>
        </div>
    </form>

    <!-- Render response data -->
    <div v-if="transactionResponse" class="mt-6 p-4 border rounded bg-gray-50">
        <h3 class="text-lg font-semibold mb-2">Transaction Details</h3>
        <p><strong>Quote ID:</strong> {{ transactionResponse.quoteId }}</p>
        <p><strong>Status:</strong> {{ transactionResponse.status }}</p>
        <p><strong>Payment ETA:</strong> {{ transactionResponse.paymentETA }}</p>
        <p><strong>Reference:</strong> {{ transactionResponse.reference }}</p>

        <p>To track the status of your transaction, please use the quoteId: {{ transactionResponse.quoteId }} below</p>
    </div>

    <Notification v-model="showNotification" :type="notificationType" :title="notificationTitle"
        :message="notificationMessage" :timeout="5000" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { getWithdrawalRequirements, singleTransaction } from '../api/api';
import { AustraliaBankDto, NigeriaBankDto, KenyaMobileMoneyDto, SingleTransactionDto } from '../api/api.interface';
import Notification from './Notification.vue';

interface BankCode {
    name: string;
    value: string;
}

const isLoading = ref(false);
const nigeriaBankCodes = ref<BankCode[]>([]);
const showNotification = ref(false);
const notificationType = ref<'success' | 'error'>('success');
const notificationTitle = ref('');
const notificationMessage = ref('');

const transactionResponse = ref<null | {
    quoteId: string;
    status: string;
    paymentETA: string;
    reference: string;
}>(null);

const form = reactive({
    toCurrency: '',
    amount: 0,
    paymentReason: '',
    country: '',
    beneficiary: undefined as AustraliaBankDto | NigeriaBankDto | KenyaMobileMoneyDto | undefined,
});

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
});

const kenyaBeneficiary = reactive<KenyaMobileMoneyDto>({
    type: "MOBILEMONEY",
    network: "MPESA",
    accountName: "",
    accountNumber: ""
});

const updateBeneficiaryFields = () => {
    switch (form.country) {
        case 'australia':
            form.beneficiary = australiaBeneficiary
            break
        case 'nigeria':
            form.beneficiary = nigeriaBeneficiary
            fetchNigeriaBankCodes()
            break
        case 'kenya':
            form.beneficiary = kenyaBeneficiary
            break
        default:
            form.beneficiary = undefined
    }
};

const fetchNigeriaBankCodes = async () => {
    try {
        const response = await getWithdrawalRequirements("NG");
        nigeriaBankCodes.value = transformBankData(response);
    } catch (error) {
        console.error('Error fetching Nigeria bank codes:', error);
    }
};

const handleSubmit = async () => {
    if (form.amount === undefined) {
        console.error('Amount is required');
        return;
    }
    isLoading.value = true;
    try {

        const transactionData: SingleTransactionDto = {
            toCurrency: form.toCurrency,
            amount: form.amount,
            paymentReason: form.paymentReason,
            country: form.country,
            beneficiary: form.beneficiary!
        };

        const response = await singleTransaction(transactionData);
        transactionResponse.value = response;

        showNotification.value = true;
        notificationType.value = 'success';
        notificationTitle.value = 'Transaction Created';
        notificationMessage.value = 'Transaction created successfully';
    } catch (error) {
        showNotification.value = true;
        notificationType.value = 'error';
        notificationTitle.value = 'Error';
        notificationMessage.value = 'Error creating transaction';
        console.error('Error creating withdrawal:', error);
    } finally {
        isLoading.value = false;
    }
};

const clearForm = () => {
    Object.assign(form, {
        fromAsset: '',
        toCurrency: '',
        amount: null,
        paymentReason: '',
        country: '',
    });
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
    });
    Object.assign(nigeriaBeneficiary, { type: "BANK", bankCode: "", accountNumber: "" });
    Object.assign(kenyaBeneficiary, { type: "MOBILEMONEY", network: "MPESA", accountName: "", accountNumber: "" });
};

function transformBankData(data: any) {
    const banks = data?.data?.destination?.BANK?.find((field: any) => field.name === "bankCode")?.banks || [];
    return banks.map((bank: any) => ({
        name: `${bank.bankName} (${bank.bankCode})`,
        value: bank.bankCode
    }));
}
</script>
