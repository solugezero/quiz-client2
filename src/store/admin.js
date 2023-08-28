import { acceptHMRUpdate, defineStore } from "pinia";
import {
  answerCreate,
  answersGet,
  questionsGet,
  questionUpdate,
  answerUpdate,
  answerDelete,
} from "~/api";
export const useAdminStore = defineStore("admin", {
  state: () => ({
    answers: [],
    questions: [],
    filters: {
      title: null,
      type: null,
    },
  }),
  actions: {
    async featchAnswers() {
      try {
        const response = await answersGet();
        this.answers = response;
      } catch (error) {
        console.log(error);
      }
    },
    async featchQuestions() {
      try {
        const response = await questionsGet();
        this.questions = response;
      } catch (error) {
        console.log(error);
      }
    },
    getAnswersById(questionId) {
      return this.answers.filter((x) => x?.questionId === questionId);
    },
  },
  getters: {
    getQuestionsHelper: (state) => {
      const { type } = state.filters;

      let getResult = [...state.questions];

      if (type) {
        getResult = getResult.filter((x) => x.type === type);
      }
      return getResult;
    },
  },
});
