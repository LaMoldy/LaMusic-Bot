import chalk from 'chalk';

export default class MessageLogger {
  static errorMessage(message) {
    console.log(chalk.red('[ERROR] ') + message);
  }

  static warningMessage(message) {
    console.log(chalk.yellow('[WARNING] ') + message);
  }

  static infoMessage(message) {
    console.log(chalk.blue('[INFO] ') + message);
  }
}