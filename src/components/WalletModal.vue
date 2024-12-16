<template>
    <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg w-full max-w-lg p-6 m-4 relative">
            <!-- Close Button -->
            <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- Content -->
            <div class="space-y-6">
                <div class="text-center">
                    <h2 class="text-2xl font-bold text-gray-800">Payment Details</h2>
                    <p class="text-gray-600 mt-2">Please send exactly the specified amount to complete your transaction
                    </p>
                </div>

                <div class="space-y-4">
                    <!-- Amount Display -->
                    <div class="p-4 bg-orange-50 rounded-lg">
                        <div class="text-sm text-gray-600">Amount to Send</div>
                        <div class="text-2xl font-bold text-gray-900">{{ amount }} {{ asset.toUpperCase() }}</div>
                    </div>

                    <!-- Wallet Address -->
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-700">Wallet Address</label>
                        <div class="relative">
                            <div class="p-4 bg-gray-50 rounded-lg break-all pr-12 font-mono text-sm">
                                {{ walletAddress }}
                            </div>
                            <button @click="copyToClipboard"
                                class="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700">
                                <template v-if="copied">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500"
                                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                        <polyline points="22 4 12 14.01 9 11.01" />
                                    </svg>
                                </template>
                                <template v-else>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                </template>
                            </button>
                        </div>
                    </div>

                    <!-- Warning Alert -->
                    <div class="rounded-lg border border-orange-200 bg-orange-50 p-4">
                        <div class="text-sm text-orange-800">
                            Please make the payment before {{ paymentDeadline }}. The quote will expire after
                            this time.
                        </div>
                    </div>

                    <!-- Instructions -->
                    <div class="space-y-2 text-sm text-gray-600">
                        <p>• Send only {{ asset }} to this address</p>
                        <p>• Include all transaction fees</p>
                        <p>• Double-check the address before sending</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    modelValue: boolean;
    walletAddress: string;
    amount: number;
    asset: string;
    paymentDeadline: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const copied = ref(false);

const close = () => {
    emit('update:modelValue', false);
};

const copyToClipboard = async () => {
    try {
        await navigator.clipboard.writeText(props.walletAddress);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
};
</script>