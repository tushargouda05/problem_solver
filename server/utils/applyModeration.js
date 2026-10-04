const moderateContent = require("./moderateText");

const User = require("../models/user");
const ModerationHistory = require("../models/moderationHistory");

const applyModeration = async ({ userId, contentType, text }) => {
  const scores = await moderateContent(text);

  const worstScore = Math.max(
    scores.toxicity,
    scores.insult
  );

  let action;
  let trustScoreChange;

  if (worstScore > 0.8) {
    action = "blocked";
    trustScoreChange = -15;
  } else if (worstScore > 0.4) {
    action = "flagged";
    trustScoreChange = -5;
  } else {
    action = "allowed";
    trustScoreChange = 0;
  }

  if (trustScoreChange !== 0) {
    await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          trustScore: trustScoreChange
        }
      }
    );
  }

  await ModerationHistory.create({
    user: userId,
    contentType,
    contentText: text,
    scores,
    action,
    trustScoreChange
  });

  return {
    action,
    scores
  };
};

module.exports = applyModeration;