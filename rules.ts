import { ruleset } from './rules.types'
const rules: ruleset = {
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
        '136': 'video game personality',
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
        '60': 'athlete',
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
        '114': 'concert',
    },
    // pop culture
    9: {
        '118': 'awards show',
        '122': 'fictional character',
        '130': 'multimedia franchise',
        '139': 'fan community',
        '109': 'reoccuring trends',
    },
    // pop culture 2
    10: {
        '58': 'entertainment personality',
        '91': 'podcast',
        '94': 'journalist',
        '110': 'viral accounts',
        '120': 'digital creator',
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
}
export default rules