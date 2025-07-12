export type Card = {
  proposal: string;
  more?: string[]; // Ajout du champ "more" pour les significations supplémentaires
  choices: {
    label: string;
    more?: string[]; // Ajout du champ "more" pour les significations supplémentaires
    correct: boolean;
  }[];
}