import { useGlobalContext } from '@/context/GlobalProvider';
import { getDataDollarInvestment } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite';
import { router } from 'expo-router';
import { useEffect } from 'react'

const DollarCheck = () => {
    const { user, loading } = useGlobalContext();

    const {
        data,
        loading: investmentLoader,
    } = useAppwrite(getDataDollarInvestment);

    useEffect(() => {
        if (loading) return;

        if (user?.dollarInvestmentId) {
            router.replace(`/dollar/${user.dollarInvestmentId}`);
            return;
        }

        if (!investmentLoader && data?.$collectionId) {
            router.replace(`/investment/new/${data.$collectionId}`);
        }
    }, [
        loading,
        investmentLoader,
        user?.dollarInvestmentId,
        data?.$collectionId,
    ]);

    return null;
};

export default DollarCheck