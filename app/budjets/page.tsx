"use client";
import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import { useUser } from "@clerk/nextjs";
import EmojiPicker from "emoji-picker-react";
import prisma from "@/lib/prisma";
import { addBudget } from "../action";

const page = () => {
  const { user } = useUser();
  const [budgetName, setBudgetName] = useState<string>("");
  const [budgetAmount, setBudgetAmount] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const handleEmojiSelect = (emojiObject: { emoji: string }) => {
    setSelectedEmoji(emojiObject.emoji);
    setShowEmojiPicker(false);
  };
  const handleAddBudget = async () => {
    try {
      const amount = parseFloat(budgetAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Montant doit etre un nombre positif");
      }
      await addBudget(
        user?.primaryEmailAddress?.emailAddress as string,
        budgetName,
        amount,
        selectedEmoji
      );
      setBudgetName("");
      setBudgetAmount("");
      setSelectedEmoji("");
      (document.getElementById("my_modal_3") as HTMLDialogElement).close();
    } catch (error) {
      console.error("Erreur lors de l'ajout du budget :", error);
    }
  };
  return (
    <Wrapper>
      <button
        className="btn"
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
      >
        Nouveau budget
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">creation d'un budjet</h3>
          <p className="py-4">Permet de controler ces depenses facilement</p>
          <div className="w-full flex flex-col">
            <input
              type="text"
              value={budgetName}
              placeholder="Nom du budget"
              onChange={(e) => setBudgetName(e.target.value)}
              className="input input-bordered w-full mb-3"
              required
            />
            <input
              type="number"
              value={budgetAmount}
              placeholder="montant du budget"
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="input input-bordered w-full mb-3"
              required
            />
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="btn btn-ghost mb-3"
            >
              {selectedEmoji || "selectionez un emoji"}
            </button>
            <div className="flex justify-center items-center my-4">
              {showEmojiPicker && (
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              )}
            </div>
            <button onClick={handleAddBudget} className="btn btn-accent">
              Ajouter budget
            </button>
          </div>
        </div>
      </dialog>
    </Wrapper>
  );
};

export default page;
