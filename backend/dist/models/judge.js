"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Judge {
    constructor(name, email, evaluations, totalEarnedPoints, totalPossiblePoints) {
        this.name = name;
        this.email = email;
        this.evaluations = evaluations;
        this.totalEarnedPoints = totalEarnedPoints;
        this.totalPossiblePoints = totalPossiblePoints;
    }
    static computeRating(judge) {
        return [judge.totalEarnedPoints / judge.totalPossiblePoints, Judge.computeStdev(judge)];
    }
    static computeStdev(judge) {
        const partialList = [];
        for (const i of judge.evaluations) {
            partialList.push(i.getTotalScore());
        }
        // compute stdev of that list
        const sumOfList = partialList.reduce((accum, current) => accum + current, 0);
        const mean = sumOfList / partialList.length;
        const sumOfVariances = partialList.reduce((accum, current) => accum + (Math.pow((current - mean), 2)), 0);
        return Math.pow((sumOfVariances / (partialList.length - 1)), (0.5));
    }
}
exports.default = Judge;
//# sourceMappingURL=Judge.js.map