"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeMeanBias = exports.computeMeanComparison = exports.computeMeanCitation = exports.computeMeanCoverage = exports.computeMeanDecision = exports.computeMean = exports.computeZ = exports.computeStdev = void 0;
const fermat_1 = require("@mathigon/fermat");
// methods
const computeStdev = (judge) => {
    const partialList = [];
    for (const i of judge.evaluations) {
        partialList.push(i.bias + i.citation + i.comparison + i.coverage + i.decision);
    }
    // compute stdev of that list
    const sumOfList = partialList.reduce((accum, current) => accum + current, 0);
    const mean = sumOfList / partialList.length;
    const sumOfVariances = partialList.reduce((accum, current) => accum + Math.pow((current - mean), 2), 0);
    return Math.pow((sumOfVariances / (partialList.length - 1)), 0.5);
};
exports.computeStdev = computeStdev;
const findFourMostRecents = (j) => {
    // this assues the judge is sorted as it should be in the axios response
    let strings = [];
    let count = 0;
    const AMOUNT_I_WANT = 4;
    for (let ev of j.evaluations) {
        if (strings.includes(ev.tournamentName))
            continue;
        else {
            strings.push(ev.tournamentName);
            count++;
        }
        if (count == AMOUNT_I_WANT) {
            return strings;
        }
    }
    return strings;
};
const computeZ = (judge, judges) => {
    const W_AVG_ALLJUDGES = (judges.reduce((accum, current) => accum + (0, exports.computeMean)(current, findFourMostRecents(current)), 0) / judges.length);
    const W_AVG_JUST_THIS_JUDGE = (0, exports.computeMean)(judge, findFourMostRecents(judge));
    let ARR_EVALS = [];
    judge.evaluations.forEach((e) => {
        let fmr = findFourMostRecents(judge);
        if (fmr.includes(e.tournamentName)) {
            ARR_EVALS.push(e.bias + e.citation + e.comparison + e.coverage + e.decision);
        }
    });
    let ARR_ALL_EVALS = [];
    judges.forEach((f) => {
        let fmr = findFourMostRecents(f);
        f.evaluations.forEach((e) => {
            if (fmr.includes(e.tournamentName)) {
                ARR_ALL_EVALS.push(e.bias + e.citation + e.comparison + e.coverage + e.decision);
            }
        });
    });
    // find stdev for both samples
    const SD_JUST_THIS_JUDGE = (0, fermat_1.stdDev)(ARR_EVALS);
    const SD_ALL_JUDGES = (0, fermat_1.stdDev)(ARR_ALL_EVALS);
    const WEIGHT_OF_JUST_ME = 0.25;
    //let denominator = (SD_ALL_JUDGES**2 * ((1/(findFourMostRecents(judge).length) + ((SD_JUST_THIS_JUDGE) + 1/(judges.reduce((acc, cur) => acc + findFourMostRecents(cur).length,0)))))) ** 0.5;
    //console.log(W_AVG_JUST_THIS_JUDGE, computeMean(judge, findFourMostRecents(judge)));
    let ZZ = (W_AVG_JUST_THIS_JUDGE - W_AVG_ALLJUDGES) / ((1 - WEIGHT_OF_JUST_ME) * SD_ALL_JUDGES + WEIGHT_OF_JUST_ME * SD_JUST_THIS_JUDGE);
    return ZZ;
};
exports.computeZ = computeZ;
const computeMean = (j, f) => {
    // f is filters
    if (f) {
        // yes filters, only do the ones inside filters
        let averages = [];
        for (let currentFilter of f) {
            // HORRIBLE O(n^4)?
            let count = 0;
            let sum = 0;
            for (let ev of j.evaluations) {
                if (ev.tournamentName == currentFilter) {
                    count++;
                    sum +=
                        ev.bias + ev.citation + ev.comparison + ev.coverage + ev.decision;
                }
            }
            averages.push(sum / count);
        }
        // now i have all the averages, so i want to average the averages
        const G = averages.reduce((acc, cur) => acc + cur, 0) / averages.length;
        return isNaN(G) ? 0 : G;
    }
    else {
        // no filters, do all of them
        let wsum = 0;
        let wtotal = 0;
        for (let ev of j.evaluations) {
            wsum +=
                (ev.bias + ev.citation + ev.comparison + ev.coverage + ev.decision) *
                    ev.weight;
            wtotal += ev.weight;
        }
        let result = wsum / wtotal;
        return isNaN(result) ? 0 : result;
    }
};
exports.computeMean = computeMean;
const computeMeanDecision = (j, f) => {
    // f is filters
    if (f) {
        // yes filters, only do the ones inside filters
        let averages = [];
        for (let currentFilter of f) {
            // HORRIBLE O(n^4)?
            let count = 0;
            let sum = 0;
            for (let ev of j.evaluations) {
                if (ev.tournamentName == currentFilter) {
                    count++;
                    sum += ev.decision;
                }
            }
            averages.push(sum / count);
        }
        // now i have all the averages, so i want to average the averages
        const G = averages.reduce((acc, cur) => acc + cur, 0) / averages.length;
        return isNaN(G) ? 0 : G;
    }
    else {
        // no filters, do all of them
        let wsum = 0;
        let wtotal = 0;
        for (let ev of j.evaluations) {
            wsum += ev.decision * ev.weight;
            wtotal += ev.weight;
        }
        let result = wsum / wtotal;
        return isNaN(result) ? 0 : result;
    }
};
exports.computeMeanDecision = computeMeanDecision;
const computeMeanCoverage = (j, f) => {
    // f is filters
    if (f) {
        // yes filters, only do the ones inside filters
        let averages = [];
        for (let currentFilter of f) {
            // HORRIBLE O(n^4)?
            let count = 0;
            let sum = 0;
            for (let ev of j.evaluations) {
                if (ev.tournamentName == currentFilter) {
                    count++;
                    sum += ev.coverage;
                }
            }
            averages.push(sum / count);
        }
        // now i have all the averages, so i want to average the averages
        const G = averages.reduce((acc, cur) => acc + cur, 0) / averages.length;
        return isNaN(G) ? 0 : G;
    }
    else {
        // no filters, do all of them
        let wsum = 0;
        let wtotal = 0;
        for (let ev of j.evaluations) {
            wsum += ev.coverage * ev.weight;
            wtotal += ev.weight;
        }
        let result = wsum / wtotal;
        return isNaN(result) ? 0 : result;
    }
};
exports.computeMeanCoverage = computeMeanCoverage;
const computeMeanCitation = (j, f) => {
    // f is filters
    if (f) {
        // yes filters, only do the ones inside filters
        let averages = [];
        for (let currentFilter of f) {
            // HORRIBLE O(n^4)?
            let count = 0;
            let sum = 0;
            for (let ev of j.evaluations) {
                if (ev.tournamentName == currentFilter) {
                    count++;
                    sum += ev.citation;
                }
            }
            averages.push(sum / count);
        }
        // now i have all the averages, so i want to average the averages
        const G = averages.reduce((acc, cur) => acc + cur, 0) / averages.length;
        return isNaN(G) ? 0 : G;
    }
    else {
        // no filters, do all of them
        let wsum = 0;
        let wtotal = 0;
        for (let ev of j.evaluations) {
            wsum += ev.citation * ev.weight;
            wtotal += ev.weight;
        }
        let result = wsum / wtotal;
        return isNaN(result) ? 0 : result;
    }
};
exports.computeMeanCitation = computeMeanCitation;
const computeMeanComparison = (j, f) => {
    // f is filters
    if (f) {
        // yes filters, only do the ones inside filters
        let averages = [];
        for (let currentFilter of f) {
            // HORRIBLE O(n^4)?
            let count = 0;
            let sum = 0;
            for (let ev of j.evaluations) {
                if (ev.tournamentName == currentFilter) {
                    count++;
                    sum += ev.comparison;
                }
            }
            averages.push(sum / count);
        }
        // now i have all the averages, so i want to average the averages
        const G = averages.reduce((acc, cur) => acc + cur, 0) / averages.length;
        return isNaN(G) ? 0 : G;
    }
    else {
        // no filters, do all of them
        let wsum = 0;
        let wtotal = 0;
        for (let ev of j.evaluations) {
            wsum += ev.comparison * ev.weight;
            wtotal += ev.weight;
        }
        let result = wsum / wtotal;
        return isNaN(result) ? 0 : result;
    }
};
exports.computeMeanComparison = computeMeanComparison;
const computeMeanBias = (j, f) => {
    // f is filters
    if (f) {
        // yes filters, only do the ones inside filters
        let averages = [];
        for (let currentFilter of f) {
            // HORRIBLE O(n^4)?
            let count = 0;
            let sum = 0;
            for (let ev of j.evaluations) {
                if (ev.tournamentName == currentFilter) {
                    count++;
                    sum += ev.bias;
                }
            }
            averages.push(sum / count);
        }
        // now i have all the averages, so i want to average the averages
        const G = averages.reduce((acc, cur) => acc + cur, 0) / averages.length;
        return isNaN(G) ? 0 : G;
    }
    else {
        // no filters, do all of them
        let wsum = 0;
        let wtotal = 0;
        for (let ev of j.evaluations) {
            wsum += ev.bias * ev.weight;
            wtotal += ev.weight;
        }
        let result = wsum / wtotal;
        return isNaN(result) ? 0 : result;
    }
};
exports.computeMeanBias = computeMeanBias;
//# sourceMappingURL=Judge.js.map