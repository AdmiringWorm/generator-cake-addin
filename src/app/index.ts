import chalk from "chalk";
import yosay = require("yosay");
import BaseGenerator from "../utils/base-generator";
import { GeneratorPrompts } from "../utils/generator-prompts";

export = class MainGenerator extends BaseGenerator {
  public async prompting() {
    const message =
      `Welcome to the ${chalk.red("cake-addin generator")}. ` +
      "We will now ask you some questions so we can set up your new Cake addin project!";
    this.log(yosay(message));

    await this.callPrompts();

    this.composeWith(require.resolve("../project"), this.allValues);
    this.composeWith(require.resolve("../appveyor"), this.allValues);
  }

  // tslint:disable-next-line: no-empty
  public writing() {}

  public end() {
    const message =
      `Thank you for using our ${chalk.red("cake-addin generator")}. ` +
      "Feel free to report any bugs on our repository! " +
      `You may now remove the ${chalk.cyan(".yo-rc.json")} file, ` +
      "if you do not plan to use any of the sub generators!";
    this.log(yosay(message));
  }

  protected _setup() {
    this.description =
      "Generate a recommended structure and recommended files for creating a Cake addin";

    this.option("build", {
      alias: "b",
      default: false,
      description: "Build the addin project after creation",
      type: Boolean,
    });

    for (const prompt of GeneratorPrompts.commonPrompts) {
      if (!prompt.name) {
        continue;
      }
      if (prompt.name === "repositoryOwner") {
        prompt.default = this.user.git.name();
      }

      this.option(prompt.name, GeneratorPrompts.getOption(prompt.name));
      this.addPrompt(prompt, true);
    }
  }
};