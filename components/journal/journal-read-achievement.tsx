"use client";

import { useEffect } from "react";

import { unlockAchievement } from "@/lib/rpg-events";

export function JournalReadAchievement() {
  useEffect(() => {
    unlockAchievement({
      id: "field-notes-reader",
      title: "FIELD NOTES",
      description: "Read a Journal field note.",
    });
  }, []);

  return null;
}
