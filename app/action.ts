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
