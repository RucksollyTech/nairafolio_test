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
        console.log(response)
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
        console.log(response)
        const data = await response.json();
        return data.data.recipient_code; // Use this for transfers
    } catch (error) {
        console.error("Error creating recipient:", error);
    }
};
// {"_bodyBlob": {"_data": {"__collector": [Object], "blobId": "936c8633-30f0-4caa-9251-f59e89ef0644", "offset": 0, "size": 589}}, "_bodyInit": {"_data": {"__collector": [Object], "blobId": "936c8633-30f0-4caa-9251-f59e89ef0644", "offset": 0, "size": 589}}, "bodyUsed": false, "headers": {"map": {"access-control-allow-origin": "*", "cf-cache-status": "DYNAMIC", "cf-ray": "90638f616f20bd98-LHR", "content-length": "589", "content-type": "application/json; charset=utf-8", "date": "Thu, 23 Jan 2025 00:10:19 GMT", "etag": "W/\"24d-VLHcBPVqgiDJR5d1kDN6yA\"", "server": "cloudflare", "set-cookie": "sails.sid=s%3ALfZK7dPQhsusoNSN4vUN1WUcK9qpPFVI.emP9%2BZNKrqPNBmDekYSK8ZI6roCav5W6%2FgtNor2ADCo; Path=/; HttpOnly; Secure; SameSite=Lax", "strict-transport-security": "max-age=15552000; includeSubDomains; preload", "vary": "X-HTTP-Method-Override, Accept-Encoding", "x-amz-apigw-id": "E0JU5G2rjoEEB2Q=", "x-amzn-remapped-connection": "keep-alive", "x-amzn-remapped-content-length": "589", "x-amzn-remapped-date": "Thu, 23 Jan 2025 00:10:19 GMT", "x-amzn-remapped-server": "nginx", "x-amzn-requestid": "17e5f9a8-68ac-4c47-8f9a-5778d443c3e4", "x-content-type-options": "nosniff"}}, "ok": true, "status": 201, "statusText": "", "type": "default", "url": "https://api.paystack.co/transferrecipient"}
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
  
  