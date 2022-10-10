const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Candidates = new Schema(
  {
    poll: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Poll"
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question"
    },
    text: {
      type: String
    },
    votes: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", Candidates);

module.exports = Candidate;
