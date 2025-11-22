"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  getReachedBudgets,
  getTotalTransactionAmount,
  getTotalTransactionCount,
} from "../actions";
import Wrapper from "../components/Wrapper";
import { CircleDollarSign, Landmark, PiggyBank } from "lucide-react";
import { Budget, Transaction } from "@/type";
import BudgetItem from "../components/BudgetItem";
import Link from "next/link";
import TransactionItem from "../components/TransactionItem";

const page = () => {
  const { user } = useUser();
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [reachedBudgetsRatio, setReachedBudgetsRatio] = useState<string | null>(
    null
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const email = user?.primaryEmailAddress?.emailAddress as string;
      if (email) {
        const amount = await getTotalTransactionAmount(email);
        const count = await getTotalTransactionCount(email);
        const reachedBudgets = await getReachedBudgets(email);

        setTotalAmount(amount);
        setTotalCount(count);
        setReachedBudgetsRatio(reachedBudgets);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <Wrapper>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      ) : (
        <div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl ">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Total des transactions
                </span>
                <span className="text-2xl font-bold text-warning">
                  {totalAmount !== null ? `${totalAmount}€` : "N/A"}
                </span>
              </div>

              <CircleDollarSign className="bg-warning w-9 h-9 rounded-full p-1 text-white" />
            </div>

            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl ">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">
                  Nombre de transactions
                </span>
                <span className="text-2xl font-bold text-warning">
                  {totalCount !== null ? `${totalCount}` : "N/A"}
                </span>
              </div>

              <PiggyBank className="bg-warning w-9 h-9 rounded-full p-1 text-white" />
            </div>

            <div className="border-2 border-base-300 p-5 flex justify-between items-center rounded-xl ">
              <div className="flex flex-col">
                <span className="text-gray-500 text-sm">Budgets atteints</span>
                <span className="text-2xl font-bold text-warning">
                  {reachedBudgetsRatio || "N/A"}
                </span>
              </div>

              <Landmark className="bg-warning w-9 h-9 rounded-full p-1 text-white" />
            </div>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default page;
