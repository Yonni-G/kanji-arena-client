export interface ProgressionItem {
  kanji: string;
  errorCount: number;
  inProgress: boolean;
  updatedAt: Date;
  createdAt: Date;
  kanjiDetails: {
    jlpt: number;
    meaning: string[];
  };
}

