<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white rounded-lg w-full max-w-2xl relative flex flex-col" style="height: 90vh;">
            <!-- Close Button -->
            <button @click="$emit('close')" class="absolute top-2 right-4 text-gray-400 hover:text-gray-600 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <!-- Fixed Header with Progress Steps -->
            <div class="p-6 border-b border-gray-200">
                <div class="px-12 mt-8">
                    <div class="relative">
                        <div class="flex items-center justify-between">
                            <!-- Connecting Lines Container -->
                            <div class="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2">
                                <div class="h-full bg-gray-200">
                                    <div :class="`h-full bg-orange-500 transition-all duration-300`"
                                        :style="`width: ${((currentStep - 1) / 3) * 100}%`" />
                                </div>
                            </div>

                            <!-- Step Circles -->
                            <div v-for="step in 4" :key="step" class="relative z-10">
                                <div :class="`w-8 h-8 rounded-full flex items-center justify-center
                                    ${currentStep >= step ? 'bg-orange-500 text-white' : 'bg-gray-200'}`">
                                    {{ step }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Scrollable Content -->
            <div class="flex-1 overflow-y-auto p-6">
                <!-- Step 1: Transaction Type -->
                <div v-if="currentStep === 1" class="space-y-4">
                    <h2 class="text-2xl font-bold text-gray-800">How would you like to proceed?</h2>
                    <div class="space-y-3">
                        <button @click="form.source = 'offchain'" :class="`w-full p-4 rounded-lg border-2 text-left
              ${form.source === 'offchain'
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-200'}`">
                            <div class="font-semibold">Use your wallet balance</div>
                            <div class="text-sm text-gray-600">Quick and seamless - directly use your existing balance
                            </div>
                        </button>
                        <button @click="form.source = 'onchain'" :class="`w-full p-4 rounded-lg border-2 text-left
              ${form.source === 'onchain'
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-orange-200'}`">
                            <div class="font-semibold">Send to our wallet</div>
                            <div class="text-sm text-gray-600">We'll provide a secure wallet address for your transfer
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Step 2: Transaction Details -->
                <div v-if="currentStep === 2" class="space-y-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Transaction Details</h2>
                    <div class="space-y-5">
                        <!-- Cryptocurrency Select -->
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Cryptocurrency</label>
                            <select v-model="form.fromAsset"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                <option value="">Select a cryptocurrency</option>
                                <option value="usdt">USDT</option>
                                <option value="usdc">USDC</option>
                                <option value="btc">BTC</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Network</label>
                            <select v-model="form.chain"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                <option value="">Select a network</option>
                                <option v-if="form.fromAsset === 'btc'" value="mainnet">Bitcoin Mainnet</option>
                                <option v-if="form.fromAsset === 'btc'" value="lightning">Lightning Network</option>
                                <option v-if="form.fromAsset !== 'btc'" value="trc20">TRC20</option>
                                <option v-if="form.fromAsset !== 'btc'" value="erc20">ERC20</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                            <select v-model="form.country" @change="updateBeneficiary"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                <option value="">Select country</option>
                                <option value="NG">Nigeria</option>
                                <option value="KE">Kenya</option>
                                <option value="AU">Australia</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Destination Currency</label>
                            <select v-model="form.toCurrency"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                <option value="">Select destination currency</option>
                                <option value="ngn">Nigerian Naira (NGN)</option>
                                <option value="kes">Kenyan Shilling (KES)</option>
                                <option value="aud">Australian Dollar (AUD)</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Payment Reason</label>
                            <input type="text" v-model="form.paymentReason"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter payment reason">
                        </div>

                        <!-- Amount Input -->
                        <div class="form-group">
                            <div class="space-y-3">
                                <!-- Amount Type Toggle -->
                                <div class="relative">
                                    <select v-model="form.amountType"
                                        class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                        <option value="" disabled>Select amount type</option>
                                        <option value="crypto">Enter {{ form.fromAsset.toUpperCase() }} amount to pay
                                        </option>
                                        <option value="fiat">Enter {{ form.toCurrency.toUpperCase() }} amount to receive
                                        </option>
                                    </select>
                                    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                <!-- Amount Input Field -->
                                <div class="relative">
                                    <input type="number" v-model="amount"
                                        class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                        :placeholder="form.amountType === 'crypto' ? `Enter ${form.fromAsset.toUpperCase()} amount to pay` : `Enter ${form.toCurrency.toUpperCase()} amount to receive`">
                                    <div class="absolute inset-y-0 right-0 flex items-center px-4">
                                        <span class="text-gray-500 text-sm">
                                            {{ form.amountType === 'crypto' ? form.fromAsset.toUpperCase() :
                                                form.toCurrency.toUpperCase() }}
                                        </span>
                                    </div>
                                </div>
                                <!-- Conversion Display -->
                                <div v-if="showConversion" class="text-sm text-gray-600">
                                    {{ conversionText }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 3: Beneficiary Details -->
                <div v-if="currentStep === 3" class="space-y-6">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6">Beneficiary Details</h2>

                    <!-- Nigeria Bank Form -->
                    <div v-if="form.country === 'NG'" class="space-y-5">
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Bank</label>
                            <select v-model="nigeriaBeneficiary.bankCode"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                <option value="">Select bank</option>
                                <option v-for="bank in nigeriaBankCodes" :key="bank.value" :value="bank.value">
                                    {{ bank.name }}
                                </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                            <input type="text" v-model="nigeriaBeneficiary.accountNumber"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter account number">
                        </div>
                    </div>

                    <!-- Kenya Mobile Money Form -->
                    <div v-if="form.country === 'KE'" class="space-y-5">
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">M-Pesa Number</label>
                            <input type="text" v-model="kenyaBeneficiary.accountNumber"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter M-Pesa number">
                        </div>
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                            <input type="text" v-model="kenyaBeneficiary.accountName"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter account name">
                        </div>
                    </div>

                    <!-- Australia Bank Form -->
                    <div v-if="form.country === 'AU'" class="space-y-5">
                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">BSB Number</label>
                            <input type="text" v-model="australiaBeneficiary.BSBNumber"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter BSB number" pattern="^\d{6}$">
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                            <input type="text" v-model="australiaBeneficiary.accountNumber"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter account number" pattern="^\d{9}$">
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                            <input type="text" v-model="australiaBeneficiary.accountName"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                placeholder="Enter account name">
                        </div>

                        <div class="form-group">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Remittance Purpose</label>
                            <select v-model="australiaBeneficiary.remittancePurpose"
                                class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                <option value="">Select remittance purpose</option>
                                <option value="EXPORTED_GOODS">Exported Goods</option>
                                <option value="DELIVERY_FEES">Delivery Fees</option>
                                <option value="TRAVEL">Travel</option>
                                <option value="HOTEL_ACCOMMODATION">Hotel Accommodation</option>
                                <option value="SERVICE_CHARGES">Service Charges</option>
                                <option value="OFFICE_EXPENSES">Office Expenses</option>
                            </select>
                        </div>

                        <!-- Beneficiary Details -->
                        <div class="space-y-3">
                            <h3 class="font-medium text-gray-900">Beneficiary Details</h3>
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Beneficiary Type</label>
                                <select v-model="australiaBeneficiary.beneficiary.beneficiaryType"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                    <option value="">Select beneficiary type</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="INDIVIDUAL">Individual</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input type="text" v-model="australiaBeneficiary.beneficiary.country"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter beneficiary country">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <input type="text" v-model="australiaBeneficiary.beneficiary.state"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter beneficiary state">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input type="text" v-model="australiaBeneficiary.beneficiary.city"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter beneficiary city">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input type="text" v-model="australiaBeneficiary.beneficiary.address"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter beneficiary address">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Post Code</label>
                                <input type="text" v-model="australiaBeneficiary.beneficiary.postCode"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter beneficiary post code">
                            </div>
                        </div>

                        <!-- Sender Details -->
                        <div class="space-y-3">
                            <h3 class="font-medium text-gray-900">Sender Details</h3>
                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Sender Type</label>
                                <select v-model="australiaBeneficiary.sender.type"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 appearance-none bg-white">
                                    <option value="">Select sender type</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="INDIVIDUAL">Individual</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                                <input type="text" v-model="australiaBeneficiary.sender.accountName"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter sender account name">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                <input type="text" v-model="australiaBeneficiary.sender.country"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter sender country">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <input type="text" v-model="australiaBeneficiary.sender.city"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter sender city">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input type="text" v-model="australiaBeneficiary.sender.address"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter sender address">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Post Code</label>
                                <input type="text" v-model="australiaBeneficiary.sender.postCode"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter sender post code">
                            </div>

                            <div class="form-group">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Business Registration
                                    Number</label>
                                <input type="text" v-model="australiaBeneficiary.sender.businessRegistrationNumber"
                                    class="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200"
                                    placeholder="Enter business registration number">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Step 4: Confirmation -->
                <div v-if="currentStep === 4 && quoteResponse" class="space-y-4">
                    <h2 class="text-2xl font-bold text-gray-800">Transaction Details</h2>
                    <div class="space-y-2 bg-gray-50 p-4 rounded-lg">
                        <div class="grid grid-cols-2 gap-2">
                            <div class="text-gray-600">Reference:</div>
                            <div class="font-medium">{{ quoteResponse.reference }}</div>

                            <div class="text-gray-600">Amount:</div>
                            <div class="font-medium">{{ quoteResponse.amount }} {{ quoteResponse.fromAsset.toUpperCase()
                                }}</div>

                            <div class="text-gray-600">Settlement Amount:</div>
                            <div class="font-medium">{{ quoteResponse.settlementAmount }} {{
                                quoteResponse.settlementCurrency.toUpperCase() }}</div>

                            <div class="text-gray-600">Exchange Rate:</div>
                            <div class="font-medium">{{ quoteResponse.exchangeRate }}</div>

                            <div class="text-gray-600">Payment ETA:</div>
                            <div class="font-medium">{{ quoteResponse.paymentETA }}</div>

                            <!-- Dynamic Beneficiary Details based on country -->
                            <template v-if="quoteResponse.beneficiaryDetails">
                                <div class="col-span-2 font-medium mt-4 mb-2">Beneficiary Details:</div>

                                <!-- Nigeria Bank Details -->
                                <template v-if="quoteResponse.beneficiaryDetails.country === 'NG'">
                                    <div class="text-gray-600">Bank:</div>
                                    <div class="font-medium">{{
                                        getSanitizedBankCodes(quoteResponse.beneficiaryDetails.destination.bankCode) }}
                                    </div>
                                    <div class="text-gray-600">Account Number:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.accountNumber }}</div>
                                </template>

                                <!-- Kenya Mobile Money Details -->
                                <template v-if="quoteResponse.beneficiaryDetails.country === 'KE'">
                                    <div class="text-gray-600">M-Pesa Number:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.accountNumber }}</div>
                                    <div class="text-gray-600">Account Name:</div>
                                    <div class="font-medium">{{ quoteResponse.beneficiaryDetails.destination.accountName
                                        }}</div>
                                </template>

                                <!-- Australia Bank Details -->
                                <template v-if="quoteResponse.beneficiaryDetails.country === 'AU'">
                                    <div class="text-gray-600">BSB Number:</div>
                                    <div class="font-medium">{{ quoteResponse.beneficiaryDetails.destination.BSBNumber
                                        }}</div>

                                    <div class="text-gray-600">Account Number:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.accountNumber }}</div>

                                    <div class="text-gray-600">Account Name:</div>
                                    <div class="font-medium">{{ quoteResponse.beneficiaryDetails.destination.accountName
                                        }}</div>

                                    <div class="text-gray-600">Remittance Purpose:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.remittancePurpose
                                        }}</div>

                                    <!-- Beneficiary Details Section -->
                                    <div class="col-span-2 font-medium mt-4 mb-2">Beneficiary Information:</div>

                                    <div class="text-gray-600">Type:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.beneficiary.beneficiaryType }}
                                    </div>

                                    <div class="text-gray-600">Country:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.beneficiary.country }}</div>

                                    <div class="text-gray-600">State:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.beneficiary.state }}</div>

                                    <div class="text-gray-600">City:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.beneficiary.city }}</div>

                                    <div class="text-gray-600">Address:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.beneficiary.address }}</div>

                                    <div class="text-gray-600">Post Code:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.beneficiary.postCode }}</div>

                                    <!-- Sender Details Section -->
                                    <div class="col-span-2 font-medium mt-4 mb-2">Sender Information:</div>

                                    <div class="text-gray-600">Type:</div>
                                    <div class="font-medium">{{ quoteResponse.beneficiaryDetails.destination.sender.type
                                        }}</div>

                                    <div class="text-gray-600">Account Name:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.sender.accountName }}</div>

                                    <div class="text-gray-600">Country:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.sender.country }}</div>

                                    <div class="text-gray-600">City:</div>
                                    <div class="font-medium">{{ quoteResponse.beneficiaryDetails.destination.sender.city
                                        }}</div>

                                    <div class="text-gray-600">Address:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.sender.address }}</div>

                                    <div class="text-gray-600">Post Code:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.sender.postCode }}</div>

                                    <div class="text-gray-600">Business Registration Number:</div>
                                    <div class="font-medium">{{
                                        quoteResponse.beneficiaryDetails.destination.sender.businessRegistrationNumber
                                        }}</div>
                                </template>
                            </template>
                        </div>

                        <div v-if="quoteResponse.expiresInText" class="mt-4 text-orange-600">
                            {{ quoteResponse.expiresInText }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Fixed Footer with Navigation Buttons -->
            <div class="border-t border-gray-200 p-6">
                <div class="flex justify-between">
                    <button @click="previousStep" v-if="currentStep > 1"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                        Back
                    </button>
                    <div v-else class="w-20"></div>

                    <button v-if="currentStep < 4" @click="nextStep" :disabled="!isCurrentStepValid || isLoading"
                        :class="`px-4 py-2 rounded-md text-white
                        ${isCurrentStepValid && !isLoading ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`">
                        {{ isLoading ? 'Processing...' : 'Next' }}
                    </button>
                    <button v-else @click="submitTransaction"
                        class="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                        {{ isLoading ? 'Processing...' : 'Confirm Transaction' }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <WalletModal v-model="showWalletModal" :wallet-address="walletAddress" :amount="walletDisplayAmount"
        :asset="walletDisplayCurrency" :payment-deadline="walletDisplayDeadline" />

    <Notification v-model="showNotification" :type="notificationType" :title="notificationTitle"
        :message="notificationMessage" :timeout="5000" />
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { AustraliaBankDto, KenyaMobileMoneyDto, NigeriaBankDto } from '../api/api.interface';
import { confirmTransaction, finalizeOfframpsQuote, getRates, getWithdrawalRequirements } from '../api/api';
import WalletModal from './WalletModal.vue';
import Notification from './Notification.vue';

const emits = defineEmits(['close'])

interface TransactionForm {
    source: 'onchain' | 'offchain' | ''
    fromAsset: string
    toCurrency: string
    chain: 'trc20' | 'erc20' | 'mainnet' | 'lightning' | ''
    amount: number
    settlementAmount: number
    amountType: 'crypto' | 'fiat' | ''
    paymentReason: string
    beneficiary: AustraliaBankDto | NigeriaBankDto | KenyaMobileMoneyDto | undefined
    country: string
}

const currentStep = ref(1)
const form = ref<TransactionForm>({
    source: '',
    fromAsset: '',
    toCurrency: '',
    chain: '',
    amount: 0,
    settlementAmount: 0,
    amountType: '',
    paymentReason: '',
    beneficiary: undefined,
    country: '',
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

const nigeriaBankCodes = ref<Array<{ name: string; value: string }>>([])

const showWalletModal = ref(false)
const walletAddress = ref('')
const walletDisplayAmount = ref(0)
const walletDisplayCurrency = ref('')
const walletDisplayDeadline = ref('')

const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

const showConversion = computed(() => {
    return (form.value.fromAsset === 'usdt' || form.value.fromAsset === 'usdc') &&
        amount.value &&
        form.value.toCurrency &&
        form.value.country;
});

function sanitizeCountryName(country: string): string {
    const countryMap: Record<string, string> = {
        'nigeria': 'NG',
        'australia': 'AU',
        'kenya': 'KE'
    };
    return countryMap[country.toLowerCase()] || country;
}

const conversionText = computed(() => {
    if (!showConversion.value) return '';

    const currentRate = rates.value.find((r: any) =>
        r.currency.toLowerCase() === form.value.toCurrency.toLowerCase() &&
        r.country === sanitizeCountryName(form.value.country)
    );

    if (!currentRate) return '';

    const rate = parseFloat((currentRate as any).rate);

    if (form.value.amountType === 'crypto') {
        const fiatAmount = (amount.value || 0) * rate;
        return `≈ ${fiatAmount.toFixed(2)} ${form.value.toCurrency.toUpperCase()}`;
    } else {
        const cryptoAmount = (amount.value || 0) / rate;
        return `≈ ${cryptoAmount.toFixed(6)} ${form.value.fromAsset.toUpperCase()}`;
    }
});

const isCurrentStepValid = computed(() => {
    switch (currentStep.value) {
        case 1:
            return !!form.value.source
        case 2:
            return !!form.value.fromAsset &&
                !!form.value.toCurrency &&
                !!form.value.chain &&
                ((form.value.amountType === 'crypto' && form.value.amount > 0) ||
                    (form.value.amountType === 'fiat' && form.value.settlementAmount > 0)) &&
                !!form.value.paymentReason
        case 3:
            if (!form.value.beneficiary) return false;

            switch (form.value.country) {
                case 'NG':
                    return !!(nigeriaBeneficiary.bankCode &&
                        nigeriaBeneficiary.accountNumber);

                case 'KE':
                    return !!(kenyaBeneficiary.accountNumber &&
                        kenyaBeneficiary.accountName);

                case 'AU':
                    return !!(australiaBeneficiary.BSBNumber &&
                        australiaBeneficiary.accountNumber &&
                        australiaBeneficiary.accountName &&
                        australiaBeneficiary.remittancePurpose &&
                        // Beneficiary details
                        australiaBeneficiary.beneficiary.beneficiaryType &&
                        australiaBeneficiary.beneficiary.country &&
                        australiaBeneficiary.beneficiary.city &&
                        australiaBeneficiary.beneficiary.address &&
                        australiaBeneficiary.beneficiary.postCode &&
                        // Sender details
                        australiaBeneficiary.sender.type &&
                        australiaBeneficiary.sender.accountName &&
                        australiaBeneficiary.sender.country &&
                        australiaBeneficiary.sender.city &&
                        australiaBeneficiary.sender.address &&
                        australiaBeneficiary.sender.postCode);

                default:
                    return false;
            }
        default:
            return true
    }
})

const isLoading = ref(false)
const quoteResponse = ref<any>(null)

const nextStep = async () => {
    if (currentStep.value === 3) {
        if (!form.value.chain) {
            console.error('Chain must be selected')
            return
        }
        if (!form.value.beneficiary) {
            console.error('Beneficiary must be selected')
            return
        }

        isLoading.value = true
        try {
            const response = await confirmTransaction(
                {
                    source: form.value.source as 'onchain' | 'offchain',
                    fromAsset: form.value.fromAsset,
                    toCurrency: form.value.toCurrency,
                    chain: form.value.chain,
                    ...(form.value.amountType === 'crypto' ? { amount: form.value.amount } : { settlementAmount: form.value.settlementAmount }),
                    paymentReason: form.value.paymentReason,
                    beneficiary: form.value.beneficiary,
                    country: form.value.country
                })
            quoteResponse.value = response.data
            currentStep.value++
        } catch (error: any) {
            notificationType.value = 'error'
            notificationTitle.value = 'Error'
            notificationMessage.value = error.response.data.message
            showNotification.value = true
            console.error('Failed to create quote:', error)
        } finally {
            isLoading.value = false
        }
    } else if (currentStep.value < 4) {
        currentStep.value++
    }
}



const previousStep = () => {
    if (currentStep.value > 1) {
        currentStep.value--
    }
}

const submitTransaction = async () => {
    isLoading.value = true

    try {
        const response = await finalizeOfframpsQuote({ quoteId: quoteResponse.value.quoteId })
        notificationType.value = 'success'
        notificationTitle.value = 'Success'
        notificationMessage.value = 'Transaction finalized successfully'
        showNotification.value = true

        if (form.value.source == 'onchain') {
            walletAddress.value = response.data.address
            walletDisplayAmount.value = response.data.amount
            walletDisplayCurrency.value = response.data.fromAsset
            walletDisplayDeadline.value = convertTimestampToMinutes(response.data.expiryTimeStamp).display
            showWalletModal.value = true
        } else {
            setTimeout(() => emits('close'), 2000);
        }
    } catch (error: any) {
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        if (error.response.data.message == 'Only "initiated" offRamp can be finalized') {
            notificationMessage.value = 'Transaction can no longer be finalized, please try again with a new quote.'
        } else {
            notificationMessage.value = error.response.data.message
        }
        showNotification.value = true
        console.error('Transaction failed:', error)
    } finally {
        isLoading.value = false
    }
}

const updateBeneficiary = () => {
    switch (form.value.country) {
        case 'AU':
            form.value.beneficiary = australiaBeneficiary
            break
        case 'NG':
            form.value.beneficiary = nigeriaBeneficiary
            fetchNigeriaBankCodes()
            break
        case 'KE':
            form.value.beneficiary = kenyaBeneficiary
            break
        default:
            form.value.beneficiary = undefined
    }
}

const fetchNigeriaBankCodes = async () => {
    try {
        const response = await getWithdrawalRequirements("NG")
        nigeriaBankCodes.value = transformBankData(response)
    } catch (error) {
        notificationType.value = 'error'
        notificationTitle.value = 'Error'
        notificationMessage.value = 'Failed to fetch nigerian banks'
        showNotification.value = true
        console.error('Error fetching Nigeria bank codes:', error)
    }
}

function transformBankData(data: any) {
    const banks = data?.data?.destination?.BANK?.find((field: any) => field.name === "bankCode")?.banks || [];
    const sanitized = banks.map((bank: any) => ({
        name: `${bank.bankName} (${bank.bankCode})`,
        value: bank.bankCode,
        bankName: bank.bankName
    }));
    localStorage.setItem('nigeriaBankCodes', JSON.stringify(sanitized)); // Save to local storage
    return sanitized;
}

// New function to fetch and sanitize bank codes from local storage
const getSanitizedBankCodes = (code: string) => {
    const storedJsonBankCodes = localStorage.getItem('nigeriaBankCodes') || '[]'

    const storedBankCodes = JSON.parse(storedJsonBankCodes);
    const bank = storedBankCodes.find((bank: any) => bank.value === code);
    return bank?.bankName;
}
const rates = ref([])
onMounted(async () => {
    const storedRates = localStorage.getItem('rates');
    if (storedRates) {
        rates.value = JSON.parse(storedRates);
    }

    try {
        const pulledRates = await getRates();
        localStorage.setItem('rates', JSON.stringify(pulledRates));
        rates.value = pulledRates;
    } catch (error: any) {
        notificationType.value = 'error';
        notificationTitle.value = 'Error';
        notificationMessage.value = error.response?.data?.message || 'Error fetching rates.';
        showNotification.value = true;
        console.error('Error fetching rates:', error);
    }
});


const amount = computed({
    // Getter: determines what value to show in the input
    get: () => form.value.amountType === 'crypto' ? form.value.amount : form.value.settlementAmount,

    // Setter: called whenever the input value changes
    set: (val) => {
        if (form.value.amountType === 'crypto')
            form.value.amount = val
        else
            form.value.settlementAmount = val
    }
})

function convertTimestampToMinutes(timestamp: any) {
    // Get current timestamp in seconds
    const currentTime = Math.floor(Date.now() / 1000);

    // Convert timestamp to number if it's a string
    const expiryTime = Number(timestamp);

    // Calculate difference in seconds
    const differenceInSeconds = expiryTime - currentTime;

    // Convert to minutes and round down
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);

    // Return different formats based on the time remaining
    if (differenceInMinutes < 0) {
        return {
            minutes: 0,
            display: 'Expired',
            isExpired: true
        };
    }

    if (differenceInMinutes > 1440) { // More than 1 day
        const days = Math.floor(differenceInMinutes / 1440);
        const remainingMinutes = differenceInMinutes % 1440;
        const hours = Math.floor(remainingMinutes / 60);
        return {
            minutes: differenceInMinutes,
            display: `${days}d ${hours}h`,
            isExpired: false
        };
    }

    if (differenceInMinutes > 60) { // More than 1 hour
        const hours = Math.floor(differenceInMinutes / 60);
        const minutes = differenceInMinutes % 60;
        return {
            minutes: differenceInMinutes,
            display: `${hours}h ${minutes}m`,
            isExpired: false
        };
    }

    return {
        minutes: differenceInMinutes,
        display: `${differenceInMinutes}m`,
        isExpired: false
    };
}


</script>

<style scoped lang="postcss">
.form-group {
    @apply relative;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>