export const fetchBanks = async () => {
    try {
        const response = await fetch("https://api.paystack.co/bank", {
            method: "GET",
            headers: {
            Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`, // Replace with your Paystack secret key
            "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error fetching banks:", error);
    }
};

// Use the /bank/resolve endpoint to validate the account number and bank.
export const validateAccount = async (accountNumber, bankCode) => {
    try {
        const response = await fetch(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`,
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        return data.data; 
    } catch (error) {
        console.error("Error validating account:", error);
    }
};
  

export const createRecipient = async (accountNumber, bankCode, name) => {
    try {
        const response = await fetch("https://api.paystack.co/transferrecipient", {
            method: "POST",
            headers: {
                Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                type: "nuban",
                name,
                account_number: accountNumber,
                bank_code: bankCode,
                currency: "NGN", 
            }),
        });
        const data = await response.json();
        return data.data.recipient_code; // Use this for transfers
    } catch (error) {
        console.error("Error creating recipient:", error);
    }
};

export const initiateTransfer = async (recipientCode, amount) => {
    try {
        const response = await fetch("https://api.paystack.co/transfer", {
                method: "POST",
                headers: {
                    Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                source: "balance",
                amount: amount * 100,
                recipient: recipientCode,
                reason: "Payment for services", 
            }),
        });
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error("Error initiating transfer:", error);
    }
};
  
// This is the one that enables u to tell the user to put in their account and auourize debit
export const initiateBankTransferPayment = async (email, amount) => {
    try {
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`, // Replace with your test/live secret key
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email, // Customer's email
                amount: amount * 100, // Amount in kobo (Naira * 100)
                channels: ["bank"], // Restrict to bank transfer
            }),
        });

        const data = await response.json();
        
        if (data.status) {
            return data.data; 
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error initiating bank transfer:", error);
    }
};

export const verifyPayment = async (reference) => {
    try {
        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`, // Replace with your test/live secret key
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error verifying payment:", error);
    }
};


export const createCustomer = async (email, firstName, lastName, phone) => {
    try {
        const response = await fetch("https://api.paystack.co/customer", {
            method: "POST",
            headers: {
                Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                first_name: firstName,
                last_name: lastName,
                phone,
            }),
        });

        const data = await response.json();

        if (data.status) {
            return data.data; // Returns the created customer object
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error creating customer:", error);
    }
};

// export const createDedicatedVirtualAccount = async (customerId) => {
//     try {
//         const response = await fetch("https://api.paystack.co/dedicated_account", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`,
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 customer: customerId,
//                 preferred_bank: "test-bank",
//             }),
//         });

//         const data = await response.json();
//         console.log({data});
//         if (data.status) {
//             return data.data; 
//         } else {
//             throw new Error(data.message);
//         }
//     } catch (error) {
//         console.error("Error creating dedicated virtual account:", error);
//     }
// };


export const createDedicatedVirtualAccount = async (email, customerId) => {
    try {
        const response = await fetch("https://api.paystack.co/dedicated_account", {
            method: "POST",
            headers: {
                Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`, // Replace with your test/live secret key
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customer: customerId,  // Paystack customer ID
                preferred_bank: "test-bank",  // Use "test-bank" for test mode or "wema-bank", "providus-bank" in live mode
                first_name: "John",
                last_name: "Doe",
                phone: "08012345678",
                email: email,
            }),
        });

        const data = await response.json();

        if (data.status) {
            return data.data; 
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error("Error creating dedicated virtual account:", error);
    }
};


export const payWithBankTransfer = async(email,amount) =>{
    try {
        const response = await fetch("https://api.paystack.co/transaction/initialize", {
            method: "POST",
            headers: {
                Authorization: `Bearer sk_test_1db522890eaf013fcc1ba58cfc049554095a1443`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                amount: amount * 100,
                channels: ["bank_transfer"],
                // callback_url: "exp://192.168.80.1:8082/payment-success",  // Handle successful payments
                // cancel_url: "exp://192.168.80.1:8082/payment-cancelled", // Restrict to bank transfer
            }),
        });
        
        const data = await response.json();
        if (data.status) {
            return data.data
        } else {
            // Handle error
        }
    } catch (error) {
        console.log(error); 
    }
    
}