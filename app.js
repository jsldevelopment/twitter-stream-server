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
// const ruleset: ruleset = {
//     1: {
//         '122': 'fictional character',
//         '130': 'multimedia franchise',
//         '71': 'video game',
//         '78': 'video game interest'
//     }
// }
var ruleset = {
    // tv
    1: {
        '3': 'tv shows',
        '4': 'tv episodes',
        '22': 'tv genres',
        '23': 'tv channels',
        '172': 'global tv show',
        '86': 'movie',
        '87': 'movie genre',
        '95': 'tv channel [entity service]',
        '117': 'movie festival',
        '56': 'actor'
    },
    // politics
    2: {
        '29': 'events',
        '31': 'community',
        '35': 'politicians',
        '38': 'political race',
        '88': 'political body'
    },
    // video games
    3: {
        '115': 'video game conference',
        '116': 'video game tournament',
        '71': 'video game',
        '78': 'video game interest',
        '79': 'video game hardware',
        '136': 'video game personality'
    },
    // esports
    4: {
        '137': 'esports team',
        '138': 'esports player',
        '149': 'esports league'
    },
    // sports
    5: {
        '6': 'sports events',
        '11': 'sport',
        '12': 'sports teams',
        '26': 'sports league',
        '40': 'sports series',
        '92': 'sports personality',
        '60': 'athlete'
    },
    // sports 2
    6: {
        '27': 'american football game',
        '28': 'nfl football game',
        '44': 'baseball game',
        '39': 'basketball game',
        '68': 'hockey game',
        '83': 'cricket match'
    },
    // hobbies
    7: {
        '84': 'book',
        '85': 'book genre',
        '152': 'food',
        '174': 'digital assets & crypto',
        '164': 'fields of study',
        '165': 'technology',
        '166': 'stocks',
        '162': 'exercise & fitness',
        '163': 'travel'
    },
    // music
    8: {
        '89': 'music album',
        '90': 'radio station',
        '54': 'musician',
        '55': 'music genre',
        '114': 'concert'
    },
    // pop culture
    9: {
        '118': 'awards show',
        '122': 'fictional character',
        '130': 'multimedia franchise',
        '139': 'fan community',
        '109': 'reoccuring trends'
    },
    // pop culture 2
    10: {
        '58': 'entertainment personality',
        '91': 'podcast',
        '94': 'journalist',
        '110': 'viral accounts',
        '120': 'digital creator'
    },
    11: {
        '155': 'weather',
        '156': 'cities',
        '157': 'colleges & universities',
        '158': 'points of interest',
        '159': 'states'
    },
    12: {
        '160': 'countries',
        '167': 'animals',
        '171': 'local news',
        '175': 'emergency events'
    }
};
// twitter api connections
var client = new twitter_api_v2_1.TwitterApi(process.env.BEARER_TOKEN || "").v2.readOnly;
(function start() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateRules()];
                case 1:
                    _a.sent();
                    setInterval(updateRules, 10 * 60 * 1000);
                    getStream();
                    return [2 /*return*/];
            }
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
        var stream, _loop_1, stream_1, stream_1_1, e_1_1, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('getting stream');
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 15, , 16]);
                    return [4 /*yield*/, client.searchStream({
                            "tweet.fields": ['author_id', 'id', 'context_annotations', 'possibly_sensitive', 'created_at']
                        })];
                case 2:
                    stream = _b.sent();
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 8, 9, 14]);
                    _loop_1 = function () {
                        var item = stream_1_1.value;
                        try {
                            console.log('item found');
                            if (item.data.text.length >= 180 && !item.data.possibly_sensitive) {
                                var entities_1 = [];
                                item.data.context_annotations.forEach(function (item) {
                                    if (!entities_1.includes(item.entity.id))
                                        entities_1.push(item.entity.id);
                                });
                                console.log('writing enity to db');
                                entities_1.forEach(function (entity) {
                                    writeToDb({
                                        entity: entity,
                                        author: item.data.author_id,
                                        tweet: item.data.id
                                    });
                                });
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                    };
                    stream_1 = __asyncValues(stream);
                    _b.label = 4;
                case 4: return [4 /*yield*/, stream_1.next()];
                case 5:
                    if (!(stream_1_1 = _b.sent(), !stream_1_1.done)) return [3 /*break*/, 7];
                    _loop_1();
                    _b.label = 6;
                case 6: return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _b.trys.push([9, , 12, 13]);
                    if (!(stream_1_1 && !stream_1_1.done && (_a = stream_1["return"]))) return [3 /*break*/, 11];
                    return [4 /*yield*/, _a.call(stream_1)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [3 /*break*/, 16];
                case 15:
                    err_1 = _b.sent();
                    console.log(err_1);
                    return [3 /*break*/, 16];
                case 16: return [2 /*return*/];
            }
        });
    });
}
function writeToDb(data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log(data);
            exports.dynamodb.update({
                TableName: 'Authors',
                Key: {
                    entity: data.entity,
                    author: data.author
                },
                UpdateExpression: 'SET tweets = list_append(if_not_exists(tweets, :empty_list), :my_value)',
                ExpressionAttributeValues: {
                    ":my_value": [data.tweet],
                    ":empty_list": []
                }
            }, function (err) {
                if (err)
                    console.log(err);
            });
            return [2 /*return*/];
        });
    });
}
