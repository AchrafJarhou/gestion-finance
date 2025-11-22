import { Transaction } from "@/type";
import Link from "next/link";
import React from "react";
interface TransactionItemProps {
  transaction: Transaction;
}
const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  return (
    <li className="flex justify-between items-center relative ">
      <div className="my-4 flex-1">
        <button className="btn">
          <div className="badge badge-accent">- {transaction.amount} €</div>
        </button>
      </div>
      <div className="md:hidden flex flex-col items-end">
        <span className="font-bold text-sm">{transaction.description}</span>
        <span className="text-sm">
          {transaction.createdAt.toLocaleDateString("fr-FR")} à{" "}
          {transaction.createdAt.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="hidden md:flex flex-1">
        <span className="font-bold text-sm ">{transaction.description}</span>
      </div>
      <div className="hidden md:flex flex-auto">
        {" "}
        {transaction.createdAt.toLocaleDateString("fr-FR")} à{" "}
        {transaction.createdAt.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div className="hidden md:flex flex-1 absolute right-2">
        <Link href={`/manage/${transaction.budgetId}`} className="btn">
          Voir plus
        </Link>
      </div>
    </li>
  );
};

export default TransactionItem;
