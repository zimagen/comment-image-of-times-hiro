const core = require("@actions/core");
const github = require("@actions/github");

const context = github.context;
const getOctokit = github.getOctokit;

const imageUrls = [
  "https://pbs.twimg.com/media/EyQknCtUUAE2Oqs?format=png",
  "https://pbs.twimg.com/media/EyQnOdmU4AQhwyD?format=png",
  "https://pbs.twimg.com/media/EXFcB1FU0AAnVx-?format=jpg",
  "https://pbs.twimg.com/media/EyQgcqdVEAER7pj?format=png",
  "https://pbs.twimg.com/media/EyQg9yGVEAAZWsm?format=png",
  "https://pbs.twimg.com/media/Eo2nBDJVEAADOF7?format=jpg",
  "https://pbs.twimg.com/media/Ek6DIaSUUAA8t9m?format=jpg",
];

function pickImage() {
  return imageUrls[Math.floor(Math.random() * imageUrls.length)];
}

const postChannelComment = async (octokit, context) => {
  const commentInfo = {
    ...context.repo,
    issue_number: context.issue.number,
  };

  const comment = {
    ...commentInfo,
    body: `![image](${pickImage()})`,
  };

  try {
    await octokit.issues.createComment(comment);
  } catch (e) {
    console.log(`Error creating comment: ${e.message}`);
  }
};

async function run() {
  try {
    const repoToken = core.getInput("repoToken");
    const isPullRequest = !!context.payload.pull_request;
    const octokit = repoToken ? getOctokit(repoToken) : undefined;

    if (repoToken && isPullRequest && !!octokit) {
      await postChannelComment(octokit, context);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
