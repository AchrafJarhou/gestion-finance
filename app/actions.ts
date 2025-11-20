"use server";

import prisma from "@/lib/prisma";
// Ajouter un utilisateur s'il n'existe pas deja
export async function checkAndAddUser(email: string | undefined) {
  if (!email) {
    return;
  }
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) {
      await prisma.user.create({
        data: { email },
      });
      console.log("Nouvel utilisateur ajoute  :", email);
    } else {
      console.log("Utilisateur existe deja :", existingUser);
    }
  } catch (error) {
    console.error("Erreur lors de la verification de lutilisateur  :", error);
  }
}
// Ajouter un budget pour un utilisateur
export async function addBudget(
  email: string,
  name: string,
  amount: number,
  selectedEmoji: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new Error("Utilisateur non trouve");
    }
    await prisma.budget.create({
      data: {
        name,
        amount,
        emoji: selectedEmoji,
        userId: user.id,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du budget :", error);
    throw error;
  }
}
// Recuperer les budgets d'un utilisateur
export async function getBudgetsByUser(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: { include: { transactions: true } } },
    });
    if (!user) {
      throw new Error("Utilisateur non trouve");
    }
    return user.budgets;
  } catch (error) {
    console.error("Erreur lors de la recuperation des budgets :", error);
    throw error;
  }
}
// Recuperer les transactions d'un budget
export async function getTrasactionsByBudgetId(budgetId: string) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });
    if (!budget) {
      throw new Error("Budget non trouvé.");
    }

    return budget;
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions:", error);
    throw error;
  }
}
// Ajouter une transaction a un budget
export async function addTransactionToBudget(
  budgetId: string,
  amount: number,
  description: string
) {
  try {
    const budget = await prisma.budget.findUnique({
      where: {
        id: budgetId,
      },
      include: {
        transactions: true,
      },
    });

    if (!budget) {
      throw new Error("Budget non trouvé.");
    }

    const totalTransactions = budget.transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);

    const totalWithNewTransaction = totalTransactions + amount;

    if (totalWithNewTransaction > budget.amount) {
      throw new Error(
        "Le montant total des transactions dépasse le montant du budget."
      );
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        emoji: budget.emoji,
        budget: {
          connect: {
            id: budget.id,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de la transaction:", error);
    throw error;
  }
}
// Supprimer un budget et ses transactions associées
export const deleteBudget = async (budgetId: string) => {
  try {
    await prisma.transaction.deleteMany({
      where: { budgetId },
    });

    await prisma.budget.delete({
      where: {
        id: budgetId,
      },
    });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression du budget et de ses transactions associées: ",
      error
    );
    throw error;
  }
};
// Supprimer une transaction
export async function deleteTransaction(transactionId: string) {
  try {
    console.log(" id de la transact", transactionId);
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });

    if (!transaction) {
      throw new Error("Transaction non trouvée.");
    }

    await prisma.transaction.delete({
      where: {
        id: transactionId,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de la transaction:", error);
    throw error;
  }
}
