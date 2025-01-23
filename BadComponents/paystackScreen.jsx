import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Picker, Button, Alert } from "react-native";

const PaystackIntegration = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [recipientCode, setRecipientCode] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const loadBanks = async () => {
      const bankList = await fetchBanks();
      setBanks(bankList);
    };
    loadBanks();
  }, []);

  const handleValidateAccount = async () => {
    // Selected bank is the code 
    const accountDetails = await validateAccount(accountNumber, selectedBank);

    if (accountDetails) {
      Alert.alert("Account Validated", `Account Name: ${accountDetails.account_name}`);
      const code = await createRecipient(accountNumber, selectedBank, accountDetails.account_name);
      setRecipientCode(code);
    } else {
      Alert.alert("Validation Failed", "Check your account details and try again.");
    }
  };

  const handleSendMoney = async () => {
    if (!recipientCode) {
      Alert.alert("Error", "Validate account first.");
      return;
    }
    const transfer = await initiateTransfer(recipientCode, amount);
    if (transfer) {
      Alert.alert("Transfer Successful", `Reference: ${transfer.transfer_code}`);
    } else {
      Alert.alert("Transfer Failed", "Check your details and try again.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select Bank</Text>
      <Picker
        selectedValue={selectedBank}
        onValueChange={(value) => setSelectedBank(value)}
        style={{ height: 50, width: "100%" }}
      >
        {banks.map((bank) => (
          <Picker.Item key={bank.code} label={bank.name} value={bank.code} />
        ))}
      </Picker>

      <Text>Account Number</Text>
      <TextInput
        placeholder="Enter account number"
        value={accountNumber}
        onChangeText={setAccountNumber}
        keyboardType="number-pad"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Text>Amount</Text>
      <TextInput
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="number-pad"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />

      <Button title="Validate Account" onPress={handleValidateAccount} />
      <Button title="Send Money" onPress={handleSendMoney} />
    </View>
  );
};

export default PaystackIntegration;
