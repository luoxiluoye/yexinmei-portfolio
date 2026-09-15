export const ACHIEVEMENTS = [
  {
    id: "memory-hunter",
    title: "MEMORY HUNTER",
    description: "Opened the first Memory Archive.",
    hint: "Open any Journey memory.",
  },
  {
    id: "archive-complete",
    title: "ARCHIVE COMPLETE",
    description: "Explored all 7 Journey memories.",
    hint: "Complete PATH 01—07.",
  },
  {
    id: "know-player",
    title: "KNOW THE PLAYER",
    description: "Inspected all 5 Fun Facts.",
    hint: "Inspect every Fun Fact on PLAYER.",
  },
  {
    id: "cat-person",
    title: "CAT PERSON",
    description: "Found the hidden footer NPC message.",
    hint: "A certain cat rewards persistence.",
  },
  {
    id: "quest-walker",
    title: "QUEST WALKER",
    description: "Visited 3 project quests.",
    hint: "Explore several project details.",
  },
  {
    id: "inventory-curious",
    title: "ITEM INSPECTOR",
    description: "Inspected a Special Item in Inventory.",
    hint: "Open one of the Special Items in Inventory.",
  },
  {
    id: "field-notes-reader",
    title: "FIELD NOTES",
    description: "Read a Journal field note.",
    hint: "Open any note in the Digital Garden.",
  },
] as const;

export type AchievementId = (typeof ACHIEVEMENTS)[number]["id"];
