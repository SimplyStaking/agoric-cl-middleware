import fs from 'fs';
import { validUrl } from './utils.js';

export class MiddlewareENV {
  constructor() {
    const {
      PORT = "3000",
      AGORIC_RPC = "http://0.0.0.0:26657",
      FROM,
      SUBMIT_RETRIES = "3",
      SEND_CHECK_INTERVAL = "45",
      EI_CHAINLINKURL,
      CREDENTIALS_FILE = "config/ei_credentials.json",
      DB_FILE = "data/database.db",
      FEEDS_FILE = "../config/feeds-config.json",
    } = process.env;

    this.PORT = PORT;
    this.AGORIC_RPC = AGORIC_RPC;
    this.FROM = FROM;
    this.SUBMIT_RETRIES = SUBMIT_RETRIES;
    this.SEND_CHECK_INTERVAL = SEND_CHECK_INTERVAL;
    this.EI_CHAINLINKURL = EI_CHAINLINKURL;
    this.CREDENTIALS_FILE = CREDENTIALS_FILE;
    this.DB_FILE = DB_FILE;
    this.FEEDS_FILE = FEEDS_FILE;

    this.validate();
  }

  /**
   * This function validates the env vars
   */
  validate() {
    assert(Number(this.PORT), "$PORT is required");
    assert(this.FROM && this.FROM != "", "$FROM is required");
    assert(validUrl(this.EI_CHAINLINKURL), "$EI_CHAINLINKURL is required");
    assert(this.checkFileExists(this.CREDENTIALS_FILE), "$CREDENTIALS_FILE does not exist")
    assert(this.checkFileExists(this.DB_FILE), "$DB_FILE does not exist")
    assert(this.checkFileExists(this.FEEDS_FILE), "$FEEDS_FILE does not exist")
  }

  /**
   * Function to check if a file exists
   * @param {string} path filepath
   * @returns {boolean} if it exists
   */
  checkFileExists(path) {
    try {
      fs.accessSync(path, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
}