"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Evaluation {
    constructor(tournamentName, roundName, // e.g., Round 1 Flight A etc.
    isPrelim, isImprovement, decision, comparison, citation, coverage, bias, weight, date) {
        this.tournamentName = tournamentName;
        this.roundName = roundName;
        this.isPrelim = isPrelim;
        this.isImprovement = isImprovement;
        this.decision = decision;
        this.comparison = comparison;
        this.citation = citation;
        this.coverage = coverage;
        this.bias = bias;
        this.weight = weight;
        this.date = date;
    }
    static computeImprovementWeight(listOfAllEvaluations) {
        let sum = 0;
        for (const i of listOfAllEvaluations) {
            sum += i.weight;
        }
        return sum * 0.25;
    }
    getTotalScore() {
        return (this.bias + this.citation + this.comparison + this.coverage + this.decision);
    }
}
exports.default = Evaluation;
//# sourceMappingURL=Evaluation.js.map