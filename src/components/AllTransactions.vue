<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Quick Action Section -->
        <div class="mb-8 bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-orange-500">KOMAJO</h1>
                    <p class="text-gray-600 mt-1">Convert your crypto to local currency in minutes</p>
                </div>
                <button @click="openTransactionModal"
                    class="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors">
                    Start New Transfer
                </button>
            </div>
        </div>

        <!-- Transactions Section -->
        <div class="bg-white rounded-xl shadow-sm relative">
            <!-- Loading Overlay -->
            <div v-if="isLoading" class="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                <div class="flex flex-col items-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    <span class="mt-2 text-sm text-gray-600">Loading transactions...</span>
                </div>
            </div>

            <div class="p-6 border-b border-gray-200">
                <h2 class="text-xl font-semibold text-gray-900">Transaction History</h2>
            </div>

            <!-- Transaction List -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <!-- Table header remains unchanged -->
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Settlement Amount
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Reference
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <!-- Table body with conditional rendering -->
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="!transactions.length && !isLoading" class="hover:bg-gray-50">
                            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                                No transactions found
                            </td>
                        </tr>
                        <tr v-for="transaction in transactions" :key="transaction.id"
                            @click="openViewTransactionModal(transaction)" class="hover:bg-gray-50 cursor-pointer"
                            :class="{ 'opacity-50': isLoading }">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {{ formatDate(transaction.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <div class="text-sm text-gray-900">
                                    {{ formatNumber(+transaction.amount) }} {{ transaction.fromAsset.toUpperCase() }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {{ formatNumber(transaction.settlementAmount) }} {{
                                    transaction.toCurrency.toUpperCase() }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                {{ transaction.reference }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center">
                                <span
                                    :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`">
                                    {{ formatStatus(transaction.status) }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>



            <!-- Pagination with disabled state -->
            <div class="px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Showing page {{ currentPage }} of {{ totalPages }}
                    </div>
                    <div class="flex space-x-2">
                        <button @click="getTransactions(currentPage - 1)" :disabled="currentPage === 1 || isLoading"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button @click="getTransactions(currentPage + 1)"
                            :disabled="currentPage >= totalPages || isLoading"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transaction Modal -->
        <TransactionModal v-if="isTransactionModalOpen" @close="closeTransactionModal" />
    </div>

    <Notification v-model="showNotification" :type="notificationType" :title="notificationTitle"
        :message="notificationMessage" :timeout="5000" />

    <ViewTransactionModal v-if="isViewTransactionModalOpen && selectedTransaction" :transaction="notNullTransaction"
        @close="closeViewTransactionModal" />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import TransactionModal from './TransactionModal.vue';
import Notification from './Notification.vue';
import ViewTransactionModal from './ViewTransactionModal.vue';
import { getAllQuotes } from '../api/api';
import { Transaction } from '../api/api.interface';



// Modal state
const isTransactionModalOpen = ref(false)

// Pagination state
const currentPage = ref(1)
const totalPages = ref(1)

// Mock transactions data - replace with actual API call
const transactions = ref<Transaction[]>([
    // {
    //     id: "b07fe2fb-493a-4e14-ad39-38860ff3bbd4",
    //     fees: 0,
    //     chain: "trc20",
    //     amount: 200,
    //     status: "pending_address_deposit",
    //     address: "TAWaGAiepeLic6ZMqNANkKf1LtzWLFTcop",
    //     quoteId: "QT_5145",
    //     fromAsset: "usdt",
    //     reference: "gUjvTWv0sj8vIFY",
    //     paymentETA: "3-5 minutes",
    //     exchangeRate: 1649.39,
    //     expiresInText: "This invoice expires in 15 minutes",
    //     paymentReason: "Funds for stuff",
    //     expiryTimeStamp: 1734132989,
    //     settlementAmount: 329878,
    //     beneficiaryDetails: {
    //         id: "1901a327-bff0-4dc3-b2da-bf38b48b3017",
    //         status: "success",
    //         country: "NG",
    //         currency: "NGN",
    //         createdAt: "2024-12-13T23:20:27.277Z",
    //         reference: "QT_5145_a777c2beb901",
    //         updatedAt: "2024-12-13T23:20:27.277Z",
    //         destination: {
    //             type: "BANK",
    //             bankCode: "000014",
    //             accountNumber: "1421795566"
    //         }
    //     },
    //     settlementCurrency: "ngn"
    // }
])

const isViewTransactionModalOpen = ref(false);
const selectedTransaction = ref<Transaction | null>(null);

const notNullTransaction = computed(() => selectedTransaction.value as Transaction)

const openViewTransactionModal = (transaction: Transaction) => {
    console.log(transaction)
    selectedTransaction.value = transaction;
    isViewTransactionModalOpen.value = true;
};

const closeViewTransactionModal = () => {
    isViewTransactionModalOpen.value = false;
    selectedTransaction.value = null;
};

const isLoading = ref(false)
const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

onMounted(async () => {
    getTransactions(1)
})

const getTransactions = async (page: number) => {
    console.log('clicked', page)
    if (isLoading.value) return; // Prevent multiple simultaneous requests

    isLoading.value = true;
    try {
        const response = await getAllQuotes(page);
        console.log(response.data)
        transactions.value = response.data.offRamps;
        totalPages.value = response.data.meta.pageCount;
        currentPage.value = response.data.meta.page;
        console.log(transactions.value, 'new trans')
    } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = 'Transaction can no longer be finalized, please try again with a new quote.'
        notificationMessage.value = error.response.data.message
        showNotification.value = true
    } finally {
        isLoading.value = false;
    }
};

const openTransactionModal = () => {
    isTransactionModalOpen.value = true
}

const closeTransactionModal = () => {
    isTransactionModalOpen.value = false
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

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


const formatStatus = (status: string) => {
    return status
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

// Add number formatter function
const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
</script>


<style scoped></style>