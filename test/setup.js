import * as chai from "chai";
import sinon from "sinon";

// Karma provided these globally via karma-sinon-chai. The suite depends on
// both: `sinon` is used unqualified throughout, and 346 assertions use chai's
// `should` style, which has to be installed onto Object.prototype explicitly.
chai.should();
globalThis.sinon = sinon;
