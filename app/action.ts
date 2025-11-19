"use server";

import prisma from "@/lib/prisma";

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
