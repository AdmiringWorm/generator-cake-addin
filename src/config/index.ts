/*!
 * generator-cake-addin - Gets you bootstrapped for creating cake addins.
 * Copyright (C) 2019 Kim J. Nordmo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Answers } from "yeoman-generator";
import { BaseGenerator, GeneratorPrompts, PromptNames } from "../utils";

export default class ConfigGenerator extends BaseGenerator {
  get promptNames() {
    return [
      PromptNames.ProjectName,
      PromptNames.EnableAllContributors,
      PromptNames.UseTabs,
      PromptNames.IndentSize,
      PromptNames.IndentYamlSize,
    ];
  }

  public prompting() {
    return this.callPrompts();
  }
  public writing() {
    const copyFiles = [".gitattributes", ".gitignore"];
    const templateFiles = [".editorconfig", "GitReleaseManager.yaml"];
    for (const file of copyFiles) {
      this.fs.copy(
        this.templatePath(file.replace(/^\./, "") + ".tmpl"),
        this.destinationPath(file)
      );
    }

    for (const file of templateFiles) {
      this.fs.copyTpl(
        this.templatePath(file.replace(/^\./, "") + ".tmpl"),
        this.destinationPath(file),
        this.allValues
      );
    }

    if (this.getBoolValue(PromptNames.EnableAllContributors)) {
      this.fs.copyTpl(
        this.templatePath("all-contributorsrc.tmpl"),
        this.destinationPath(".all-contributorsrc"),
        this.allValues
      );
    }
  }
  protected _setup() {
    this.description = "Creates common configuration files for running builds";

    for (const name of this.promptNames) {
      this.addOption(name);
      if (
        name !== PromptNames.IndentSize ||
        !this.getBoolValue(PromptNames.UseTabs, false)
      ) {
        this.addPrompt(name, true);
      }
    }

    const whenCondition = (answers: Answers) =>
      answers.enableAllContributors ||
      this.getBoolValue(PromptNames.EnableAllContributors);
    const projectOwnerPrompt = GeneratorPrompts.getPrompt(
      PromptNames.RepositoryOwner
    );
    projectOwnerPrompt.when = whenCondition;

    this.addOption(PromptNames.RepositoryOwner);
    this.addPrompt(projectOwnerPrompt, true);
  }
}
