export type Card = {
  proposal: string;
  choices: {
    label: string;
    correct: boolean;
  }[];
}