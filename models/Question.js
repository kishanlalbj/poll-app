const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    },
    text: {
      type: String
    }
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);

module.exports = Question;
