const questions = {
  state: {
    questions: [],
    question: {},
  },
  getters: {
    questions(state) {
      return state.questions;
    },
    question(state) {
      return state.question;
    },
  },
  mutations: {
    questions(state, payload) {
      state.questions = payload;
    },
    question(state, payload) {
      state.question = payload;
    },
    addQuestion(state, payload) {
      state.questions.push(payload);
    },
    saveQuestion(state, payload) {
      state.questions = state.questions.map((x) => {
        if (x._id == payload._id) {
          return payload;
        }
        return x;
      });
    },
    deleteQuestion(state, payload) {
      let index = state.questions.findIndex((x) => x._id == payload._id);
      state.questions.splice(index, 1);
    },
  },
  actions: {
    allQuestion(context) {
      try {
        context.dispatch("getAxios", "question").then((res) => {
          context.commit("questions", res.data);
        }).catch((error) => {
          console.log(error)
      })
      } catch (error) {
        console.log(error);
      }
    },
    getQuestion(context, payload) {
      try {
        return context.dispatch("getAxios", `question/${payload}`);
      } catch (error) {
        console.log(error);
      }
    },
    postQuestion(context, payload) {
      try {
        context
          .dispatch("postAxios", {
            url: "question",
            data: payload,
          })
          .then((res) => {
            context.commit("addQuestion", res.data);
          }).catch((error) => {
            console.log(error)
        })
      } catch (error) {
        console.log(error);
      }
    },
    editQuestion(context, payload) {
      try {
        context
          .dispatch("editAxios", {
            url: `question/edit/${payload._id}`,
            data: payload,
          })
          .then((res) => {
            context.commit("saveQuestion", res.data);
          }).catch((error) => {
            console.log(error)
        })
      } catch (error) {
        console.log(error);
      }
    },
    deleteQuestion(context, payload) {
      try {
        context
          .dispatch("deleteAxios", `question/delete/${payload}`)
          .then((res) => {
            context.commit("deleteQuestion", res.data);
          }).catch((error) => {
            console.log(error)
        })
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default questions;
