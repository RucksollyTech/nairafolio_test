import { getNIN } from "./appwrite";

const VerifyNIN = async (nin) => {
    const appId = '67e692dcc5f45aec8ae199bf'; 
    const appKey = 'test_sk_J2kkwnXncUHefpCpM2VerJM1H'; 
    let ninData   
    try {
      const checkNIN = await getNIN(nin);
      if (checkNIN) {
        return null;
      }
      // https://api.dojah.io for production
      await fetch(`https://sandbox.dojah.io/api/v1/kyc/nin?nin=${nin}`, {
        headers: {
          "AppId": appId,
          "Authorization": appKey
        }
      })
        .then(res => res.json())
        .then(data => {
            ninData = data;
        });
        return ninData
    } catch (error) {
      console.log('Error verifying NIN:', error);
      return null;
    }
  };
export default VerifyNIN

