const core = require("@actions/core");
const exec = require("@actions/exec");
const github = require("@actions/github");

async function run() {
  try {
    console.log("Checkout code");

    await exec.exec(`git clone ${github.repository}`);

    const branch = github.ref.split('/')[2]
    await exec.exec(`git checkout ${branch}`);

    const bootstrap = core.getInput("bootstrap"),
      build_command = core.getInput("build_command"),
      dist_path = core.getInput("dist_path");

    console.log(`Bootstrapping repo`);
    await exec.exec(bootstrap);

    console.log(`Building Changes`);
    await exec.exec(build_command);

    core.setOutput("Building repo completed @ ", new Date().toTimeString());
    core.setOutput("size", await exec.exec(`du ${dist_path}`));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
