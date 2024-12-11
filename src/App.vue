<template>
  <div class="min-h-screen flex flex-col">
    <!-- Title -->
    <div class="p-4 bg-white border-b">
      <h1 class="text-2xl font-bold text-blue-600">KOMAJO</h1>
    </div>

    <div class="h-[20%] p-4 border-b">
      <ExchangeRates />
    </div>

    <!-- Tabs -->
    <div class="p-4 border-b">
      <div class="flex space-x-4">
        <button @click="activeTab = 'single-transaction'" :class="[
          'px-4 py-2 rounded-t-lg',
          activeTab === 'single-transaction'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        ]">
          Single Transaction
        </button>
        <button @click="activeTab = 'step-by-step'" :class="[
          'px-4 py-2 rounded-t-lg',
          activeTab === 'step-by-step'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 hover:bg-gray-200'
        ]">
          Step by Step
        </button>
      </div>
    </div>

    <!-- Tab Content -->
    <div v-if="activeTab === 'step-by-step'" class="flex-1">

      <div class="h-[60%] p-4 border-b">
        <h2 class="text-xl font-semibold mb-4">Payout Management</h2>
        <PayoutForms />
      </div>

      <div class="h-[20%] p-4">
        <div class="space-y-6">
          <div>
            <h2 class="text-xl font-semibold mb-4">Wallet Transfer</h2>
            <PayToWallet />
          </div>

        </div>
      </div>
    </div>

    <div v-else class="flex-1 p-4">
      <!-- Single Transaction tab content -->
      <h2 class="text-xl font-semibold mb-4">Send USDT</h2>
      <SingleTransactionForm />
    </div>

    <div>
      <h2 class="text-xl font-semibold my-6">Quote Lookup</h2>
      <QuoteLookup />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ExchangeRates from "./components/ExchangeRates.vue";
import PayoutForms from "./components/PayoutForms.vue";
import QuoteLookup from "./components/QuoteLookup.vue";
import PayToWallet from "./components/PayToWallet.vue";
import SingleTransactionForm from "./components/SingleTransactionForm.vue";

const activeTab = ref('single-transaction');
</script>

<style scoped></style>
