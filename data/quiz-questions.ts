import { QuizQuestion } from '~/stores/quiz';

/**
 * Base de données de questions pour le quiz.
 * Pour ajouter de nouvelles questions, il suffit d'ajouter un nouvel objet à ce tableau.
 * Chaque question doit avoir :
 * - id: un identifiant unique (nombre)
 * - question: le texte de la question
 * - options: un tableau de 4 options de réponse
 * - answer: l'index de la bonne réponse (0-3)
 * - explanation: une explication de la bonne réponse (optionnel)
 * - category: la catégorie de la question (optionnel)
 * - difficulty: la difficulté de la question ('facile', 'moyen', 'difficile') (optionnel)
 * - image: url d'une image associée à la question (optionnel)
 */
export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Quelle est la date de naissance d'Emmanuel ?",
    options: ["1er janvier", "15 mars", "30 avril", "22 décembre"],
    answer: 2,
    explanation: "Emmanuel est né le 30 avril.",
    category: "Personnel",
    difficulty: "facile"
  },
  {
    id: 2,
    question: "Quel est le plat préféré d'Emmanuel ?",
    options: ["Pizza", "Poulet DG", "Sushi", "Lasagnes"],
    answer: 1,
    explanation: "Le Poulet DG (Directeur Général) est un plat traditionnel camerounais très apprécié d'Emmanuel.",
    category: "Gastronomie",
    difficulty: "moyen"
  },
  {
    id: 3,
    question: "Quel sport Emmanuel pratique-t-il régulièrement ?",
    options: ["Football", "Basketball", "Tennis", "Natation"],
    answer: 3,
    explanation: "Emmanuel est un passionné de natation et pratique ce sport régulièrement.",
    category: "Loisirs",
    difficulty: "moyen"
  },
  {
    id: 4,
    question: "Quelle est la couleur préférée d'Emmanuel ?",
    options: ["Rouge", "Bleu", "Vert", "Noir"],
    answer: 1,
    explanation: "Le bleu est la couleur préférée d'Emmanuel.",
    category: "Personnel",
    difficulty: "facile"
  },
  {
    id: 5,
    question: "Quel est le film préféré d'Emmanuel ?",
    options: ["Star Wars", "Le Parrain", "Inception", "Matrix"],
    answer: 2,
    explanation: "Inception, réalisé par Christopher Nolan, est le film préféré d'Emmanuel.",
    category: "Divertissement",
    difficulty: "moyen"
  },
  {
    id: 6,
    question: "Quel est le pays que rêve de visiter Emmanuel ?",
    options: ["Japon", "Brésil", "Nouvelle-Zélande", "Egypte"],
    answer: 0,
    explanation: "Le Japon et sa culture fascinante sont en tête de la liste des voyages rêvés d'Emmanuel.",
    category: "Voyages",
    difficulty: "difficile"
  },
  {
    id: 7,
    question: "Quel animal Emmanuel préfère-t-il ?",
    options: ["Chien", "Chat", "Dauphin", "Aigle"],
    answer: 2,
    explanation: "Emmanuel est fasciné par l'intelligence des dauphins.",
    category: "Animaux",
    difficulty: "difficile"
  },
  {
    id: 8,
    question: "Quelle musique Emmanuel écoute-t-il le plus souvent ?",
    options: ["Rock", "Jazz", "Hip-hop", "Classique"],
    answer: 1,
    explanation: "Emmanuel apprécie particulièrement le jazz et son improvisation.",
    category: "Musique",
    difficulty: "moyen"
  }
];

/**
 * Pour ajouter de nouvelles questions, il suffit de copier et adapter ce modèle :
 
  {
    id: 9, // Incrémenter pour chaque nouvelle question
    question: "Texte de votre question ?",
    options: ["Option 1", "Option 2", "Option 3", "Option 4"],
    answer: 0, // Index de la bonne réponse (0-3)
    explanation: "Explication de la bonne réponse",
    category: "Catégorie", // Ex: Personnel, Loisirs, Profession, etc.
    difficulty: "facile" // "facile", "moyen", ou "difficile"
  },
 
 */
