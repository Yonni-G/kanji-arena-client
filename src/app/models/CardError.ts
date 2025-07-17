export type CardError = {
  proposal: string;
  more?: string[]; // Ajout du champ "more" pour les significations supplémentaires
  correct: string;
  unCorrect: string;
};