const assert = require("assert");
const { normalizeKey, normalizeHeaders, getMissingFeatures, selectModelFeatures, predictTraffic, trainedModelAvailable } = require("./ml-model");
const featureColumns = require("./ml-model-metadata.json").feature_configuration.features;

assert.strictEqual(normalizeKey(" Destination Port "), "destination_port");
assert.strictEqual(normalizeKey(" Label "), "label");
assert.deepStrictEqual(normalizeHeaders(["Fwd Header Length", "Fwd Header Length"]), ["fwd_header_length", "fwd_header_length_1"]);

const row = Object.fromEntries(featureColumns.map((feature, index) => [feature, index]));
row.source_ip = "192.168.1.10";
row.destination_ip = "10.0.0.5";
row.label = "DoS";
row.unrelated_metadata = "ignored";
assert.deepStrictEqual(getMissingFeatures(Object.keys(row)), []);
assert.deepStrictEqual(Object.keys(selectModelFeatures(row)), featureColumns);
assert.strictEqual(selectModelFeatures(row).source_ip, undefined);
assert.strictEqual(selectModelFeatures(row).label, undefined);
assert.deepStrictEqual(getMissingFeatures(featureColumns.slice(1)), [featureColumns[0]]);

if (!trainedModelAvailable()) {
    assert.throws(() => predictTraffic({}), /trained CIC-IDS2017 model is required/i);
}

console.log("ML model contract tests passed.");
