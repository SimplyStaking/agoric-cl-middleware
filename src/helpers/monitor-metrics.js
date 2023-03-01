import { Registry, Gauge } from "prom-client";

export class MonitorMetrics {
  constructor() {
    // Create a Registry which registers the metrics
    this.register = new Registry();

    // Add a default label which is added to all metrics
    this.register.setDefaultLabels({
      app: "agoric-cl-oracle-monitor",
    });

    // Create gauge for value
    this.oracleSubmission = new Gauge({
      name: "oracle_latest_value",
      help: "Latest value submitted by oracle",
      labelNames: ["oracleName", "oracle", "feed"],
    });

    // Create gauge for timestamp
    this.oracleLastEpoch = new Gauge({
      name: "oracle_last_observation",
      help: "Last epoch in which oracle made an observation",
      labelNames: ["oracleName", "oracle", "feed"],
    });

    // Create gauge for last round
    this.oracleLastRound = new Gauge({
      name: "oracle_last_round",
      help: "Last round in which oracle made an observation",
      labelNames: ["oracleName", "oracle", "feed"],
    });

    // Create gauge for price deviation
    this.oracleDeviation = new Gauge({
      name: "oracle_price_deviation",
      help: "Latest price deviation by oracle",
      labelNames: ["oracleName", "oracle", "feed"],
    });

    // Create gauge for balance
    this.oracleBalance = new Gauge({
      name: "oracle_balance",
      help: "Oracle balances",
      labelNames: ["oracleName", "oracle", "brand"],
    });

    // Create gauge for last price
    this.actualPriceGauge = new Gauge({
      name: "actual_price",
      help: "Actual last price from feed",
      labelNames: ["feed"],
    });

    // Register the gauges
    this.register.registerMetric(this.oracleSubmission);
    this.register.registerMetric(this.oracleLastEpoch);
    this.register.registerMetric(this.oracleLastRound);
    this.register.registerMetric(this.oracleBalance);
    this.register.registerMetric(this.oracleDeviation);
    this.register.registerMetric(this.actualPriceGauge);
  }

  /**
   * Function to update metrics
   * @param {string} oracleName oracle name
   * @param {string} oracle oracle address
   * @param {string} feed feed name (Ex. ATOM-USD)
   * @param {number} value new feed value
   * @param {number} id submission id which is a timestamp
   * @param {number} actualPrice feed actual aggregated price
   * @param {number} lastRound latest round id for which there was a submission
   */
  updateMetrics(oracleName, oracle, feed, value, id, actualPrice, lastRound) {
    // Calculate price deviation from actual value
    let priceDeviation = Math.abs((value - actualPrice) / actualPrice) * 100;

    this.oracleSubmission.labels(oracleName, oracle, feed).set(value);
    this.oracleLastEpoch.labels(oracleName, oracle, feed).set(id);
    this.oracleLastRound.labels(oracleName, oracle, feed).set(lastRound);
    this.oracleDeviation.labels(oracleName, oracle, feed).set(priceDeviation);
    this.actualPriceGauge.labels(feed).set(actualPrice);
  }

  /**
   * Function to update balance metrics
   * @param {string} oracleName oracle name
   * @param {string} oracle oracle address
   * @param {string} brand brand
   * @param {number} value balance value to set
   */
  updateBalanceMetrics(oracleName, oracle, brand, value) {
    this.oracleBalance.labels(oracleName, oracle, brand).set(value);
  }
}
