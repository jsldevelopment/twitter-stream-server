"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.dynamodb = void 0;
var AWS = require("aws-sdk");
var twitter_api_v2_1 = require("twitter-api-v2");
require("dotenv/config");
var fs = require("fs");
// aws stuff below here ----------------
AWS.config.update({
    region: "us-east-1"
});
// dynamodb
var credentials = new AWS.SharedIniFileCredentials();
AWS.config.credentials = credentials;
exports.dynamodb = new AWS.DynamoDB.DocumentClient();
// study 131 - unified twitter taxonomy
// what is a vertical vs a category
var ruleset = {
    1: {
        '3': 'tv shows',
        '4': 'tv episodes',
        '6': 'sports events',
        '10': 'person',
        '11': 'sport',
        '12': 'sports teams',
        '13': 'place',
        '22': 'tv genres',
        '23': 'tv channels',
        '26': 'sports league'
    },
    2: {
        '27': 'american football game',
        '28': 'nfl football game',
        '29': 'events',
        '31': 'community',
        '35': 'politicians',
        '38': 'political race',
        '39': 'basketball game',
        '40': 'sports series',
        '44': 'baseball game',
        '45': 'brand vertical'
    },
    '3': {
        '46': 'brand category',
        '47': 'brand',
        '48': 'product',
        '54': 'musician',
        '55': 'music genre',
        '56': 'actor',
        '58': 'entertainment personality',
        '60': 'athlete',
        '65': 'interests and hobbies vertical',
        '66': 'interests and hobbies catergory'
    },
    '4': {
        '67': 'interests and hobbies',
        '68': 'hockey game',
        '71': 'video game',
        '78': 'video game interest',
        '79': 'video game hardware',
        '83': 'cricket match',
        '84': 'book',
        '85': 'book genre',
        '86': 'movie',
        '87': 'movie genre'
    },
    '5': {
        '88': 'political body',
        '89': 'music album',
        '90': 'radio station',
        '91': 'podcast',
        '92': 'sports personality',
        '93': 'coach',
        '94': 'journalist',
        '95': 'tv channel [entity service]',
        '109': 'reoccuring trends',
        '110': 'viral accounts'
    },
    '6': {
        '114': 'concert',
        '115': 'video game conference',
        '116': 'video game tournament',
        '117': 'movie festival',
        '118': 'awards show',
        '119': 'holiday',
        '120': 'digital creator',
        '122': 'fictional character',
        '130': 'multimedia franchise',
        '136': 'video game personality'
    },
    '7': {
        '137': 'esports team',
        '138': 'esports player',
        '139': 'fan community',
        '149': 'esports league',
        '152': 'food',
        '155': 'weather',
        '156': 'cities',
        '157': 'colleges & universities',
        '158': 'points of interest',
        '159': 'states'
    },
    '8': {
        '160': 'countries',
        '162': 'exercise & fitness',
        '163': 'travel',
        '164': 'fields of study',
        '165': 'technology',
        '166': 'stocks',
        '167': 'animals',
        '171': 'local news',
        '172': 'global tv show',
        '174': 'digital assets & crypto',
        '175': 'emergency events'
    }
};
// twitter api connections
var client = new twitter_api_v2_1.TwitterApi(process.env.BEARER_TOKEN || "").v2.readOnly;
(function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // await updateRules()
            // setInterval(updateRules, 10 * 60 * 1000)
            getStream();
            return [2 /*return*/];
        });
    });
}());
function updateRules() {
    return __awaiter(this, void 0, void 0, function () {
        var data, parsedData, nextRule, rules, ids;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    data = fs.readFileSync('./temp.json', 'utf-8');
                    parsedData = JSON.parse(data);
                    nextRule = (Object.entries(ruleset).length === parsedData.currentRule) ? 1 : parsedData.currentRule + 1;
                    return [4 /*yield*/, getRules()];
                case 1:
                    rules = _a.sent();
                    if (!rules.length) return [3 /*break*/, 3];
                    ids = rules.map(function (rule) {
                        return rule.id;
                    });
                    return [4 /*yield*/, deleteRules(ids)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, addRules(ruleset[nextRule])];
                case 4:
                    _a.sent();
                    parsedData.currentRule = nextRule;
                    fs.writeFileSync('./temp.json', JSON.stringify(parsedData));
                    return [2 /*return*/];
            }
        });
    });
}
function getRules() {
    return __awaiter(this, void 0, void 0, function () {
        var rules;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.streamRules()];
                case 1:
                    rules = _a.sent();
                    console.log(rules);
                    return [2 /*return*/, rules.data ? rules.data : []];
            }
        });
    });
}
function addRules(rules) {
    return __awaiter(this, void 0, void 0, function () {
        var rulesToAdd, _i, _a, _b, key, value;
        return __generator(this, function (_c) {
            rulesToAdd = [];
            for (_i = 0, _a = Object.entries(rules); _i < _a.length; _i++) {
                _b = _a[_i], key = _b[0], value = _b[1];
                rulesToAdd.push({
                    tag: value,
                    value: "context:".concat(key, ".* -is:retweet -is:quote -is:reply -has:mentions lang:en")
                });
            }
            console.log(rulesToAdd);
            client.updateStreamRules({ add: rulesToAdd })
                .then(function (response) {
                console.log(JSON.stringify(response));
            })["catch"](function (err) {
                console.log(err);
            });
            return [2 /*return*/];
        });
    });
}
function deleteRules(rules) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            client.updateStreamRules({ "delete": { ids: rules } })
                .then(function () {
                console.log('rules deleted');
            });
            return [2 /*return*/];
        });
    });
}
function getStream() {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function () {
        var stream, count, stream_1, stream_1_1, item, e_1_1, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 14, , 15]);
                    return [4 /*yield*/, client.searchStream({
                            "tweet.fields": ['author_id', 'id', 'context_annotations']
                        })
                        // how do we want to handle writing this data??????
                    ];
                case 1:
                    stream = _b.sent();
                    count = 0;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 13]);
                    stream_1 = __asyncValues(stream);
                    _b.label = 3;
                case 3: return [4 /*yield*/, stream_1.next()];
                case 4:
                    if (!(stream_1_1 = _b.sent(), !stream_1_1.done)) return [3 /*break*/, 6];
                    item = stream_1_1.value;
                    // TODO: this shit
                    // const contexts = item.data.context_annotations.reduce((prev, curr) => {
                    //     return {
                    //         entity: [ ...prev.entity, curr.entity.id ]
                    //     }
                    // }, { entity: [] })
                    console.log(count++);
                    _b.label = 5;
                case 5: return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 13];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 13];
                case 8:
                    _b.trys.push([8, , 11, 12]);
                    if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1["return"]))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _a.call(stream_1)];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 12: return [7 /*endfinally*/];
                case 13: return [3 /*break*/, 15];
                case 14:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 15];
                case 15: return [2 /*return*/];
            }
        });
    });
}
function writeToDb(entity) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            exports.dynamodb.batchWrite({
                RequestItems: {
                    "Entity": [{
                            PutRequest: {
                                Item: entity
                            }
                        }]
                }
            }, function (err, data) {
                if (err)
                    console.log(err);
                else
                    console.log(data);
            });
            return [2 /*return*/];
        });
    });
}
