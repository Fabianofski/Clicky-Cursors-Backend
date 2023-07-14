export interface SaveData {
  coins: bigint;
  displayName?: string;
  password?: string;
  buildingItems: { [key: string]: number };
  cursorItems: { [key: string]: number };
  recipeItems: { [key: string]: number };
  timestamp: Date;
}
