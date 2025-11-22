"use client";

import { Transaction } from "@/type";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { getTransactionsByEmailAndPeriod } from "../actions";
import Wrapper from "../components/Wrapper";
import TransactionItem from "../components/TransactionItem";

const page = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = async (period: string) => {
    if (user?.primaryEmailAddress?.emailAddress) {
      setLoading(true);
      try {
        const transactionsData = await getTransactionsByEmailAndPeriod(
          user?.primaryEmailAddress?.emailAddress,
          period
        );
        setTransactions(transactionsData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des transactions: ", err);
      }
    }
  };

  useEffect(() => {
    fetchTransactions("last30");
  }, [user?.primaryEmailAddress?.emailAddress]);

  return (
    <Wrapper>
      <div className="overflow-x-auto w-full bg-base-200/35 p-5 rounded-xl">
        {loading ? (
          <div className="w-full flex justify-center items-center h-[50vh]">
            <span className="loading loading-bars loading-xs"></span>
            <span className="loading loading-bars loading-sm"></span>
            <span className="loading loading-bars loading-md"></span>
            <span className="loading loading-bars loading-lg"></span>
            <span className="loading loading-bars loading-xl"></span>
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex justify-center items-center h-full ">
            <span className="text-gray-500 text-sm">
              Aucune transactions a afficher{" "}
            </span>
          </div>
        ) : (
          <ul className="divide-y divide-base-300">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
