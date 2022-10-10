var express = require("express");
const { default: mongoose } = require("mongoose");
const Candidates = require("../models/Candidates");
const Poll = require("../models/Poll");
const Question = require("../models/Question");
var router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const polls = await Poll.find().select({ name: 1 }).sort({ createdAt: -1 });

    res.json(polls);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, questions = [] } = req.body;

    const poll = new Poll({ name });

    const savedPoll = await poll.save();

    for (let i = 0; i < questions.length; i++) {
      const newQuestion = new Question({ poll: savedPoll.id, ...questions[i] });
      const savedQuestion = await newQuestion.save();

      for (let j = 0; j < questions[i].options.length; j++) {
        const newCandidate = new Candidates({
          poll: savedPoll.id,
          question: savedQuestion.id,
          text: questions[i].options[j]
        });

        await newCandidate.save();
      }
    }

    res.json({ poll: savedPoll });
  } catch (error) {
    next(error);
  }
});

router.get("/questions/:pollId", async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const questions = await Question.find({ poll: pollId }).lean();

    await Promise.all(
      questions.map(async (q) => {
        const res = await Candidates.find({ question: q._id }).select("text");
        q.options = res;
      })
    );

    res.send(questions);
  } catch (error) {
    next(error);
  }
});

router.post("/:pollId/submit", async (req, res, next) => {
  try {
    const { answers } = req.body;

    await Promise.all(
      answers.map(async (answer) => {
        console.log(answer.poll, answer.selectedAnswer);
        let result = await Candidates.findOneAndUpdate(
          {
            poll: mongoose.Types.ObjectId(answer.poll),
            _id: mongoose.Types.ObjectId(answer.selectedAnswer)
          },
          {
            $inc: { votes: 1 }
          },
          { new: 1 }
        );

        console.log(result);
      })
    );
    res.json({ messge: "success" });
  } catch (error) {
    next(error);
  }
});

router.get("/:pollId/result", async (req, res) => {
  try {
    const questions = await Question.find({ poll: req.params.pollId }).lean();

    await Promise.all(
      questions.map(async (q) => {
        const result = await Candidates.find({
          poll: req.params.pollId,
          question: q._id
        }).select({
          text: 1,
          votes: 1
        });

        q.options = result;
      })
    );

    for (let i = 0; i < questions.length; i++) {
      let max = questions[i].options[0].votes;

      for (let j = 0; j < questions[i].options.length; j++) {
        if (questions[i].options[j].votes > max) {
          max = questions[i].options[j].votes;
          option = questions[i].options[j]._id;
        }
      }

      questions[i].winner = max;
    }

    res.send(questions);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
