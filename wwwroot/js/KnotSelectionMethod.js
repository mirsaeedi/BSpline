﻿var knotVectorSelectionMethods = function () {

    var self={};
    
    self.getKnots=function(dataPoints,p,h,parameters,knotSelectionMethodName) {
        
        if(knotSelectionMethodName==='uniformly-spaced'){
            return knotVectorSelectionMethods.uniformlySpaced(p, h);
        }
        else if (knotSelectionMethodName==='deboor-average'){
            return knotVectorSelectionMethods.deboorAverage(p,h,parameters); 
        }

    }

    self.uniformlySpaced = function (p, n) {

        var knots = [];

        for (var i = 0; i < p + 1; i++) {
            knots.push(0);
        }

        for (var i = 1; i <= n - p; i++) {
            knots.push(i / (n - p + 1));
        }

        for (var i = 0; i < p + 1; i++) {
            knots.push(1);
        }

        return knots;

    }

    self.deboorAverage = function (p, h, parameters) {

        var knots = [];

        var n = parameters.length - 1;

        for (var i = 0; i < p + 1; i++) {
            knots.push(0);
        }

        /*
        for (var i = 1; i <= h - p ; i++) {
    
            var sum=0.0;
            for (var index = i; index < i+p; index++) {
                sum+=parameters[index];
            }
    
            knots.push(sum/p);
        }
        */

        var d = (n + 1) / (h - p + 1);

        for (var i = 1; i <= h - p; i++) {

            var j = parseInt(i * d);
            var alpha = i * d - j;

            knots.push(parameters[j- 1] + alpha * (parameters[j]-parameters[j - 1]));
        }

        for (var i = 0; i < p + 1; i++) {
            knots.push(1);
        }

        return knots;

    }

    return self;

} ();

