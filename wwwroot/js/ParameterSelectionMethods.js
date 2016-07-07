﻿var parameterSelectionMethods = function () {

    var self={};

    self.getParameters=function(dataPoints,parameterSelectionMethodName) {
        
        if(parameterSelectionMethodName==='uniformly-spaced'){
            return parameterSelectionMethods.uniformlySpacedMethod(dataPoints);
        }
        else if (parameterSelectionMethodName==='chord-length'){
            return parameterSelectionMethods.chordLengthMethod(dataPoints);
        }
        else if (parameterSelectionMethodName==='centripetal'){
            return parameterSelectionMethods.centripetalMethod(dataPoints,0.5);
        }   
    }

    self.uniformlySpacedMethod = function (dataPoints) {

        var parameters = [];
        var n = dataPoints.length - 1;

        for (var i = 0; i <= n; i++) {

            parameters.push(i / n);

        }

        return parameters;

    }

    self.chordLengthMethod = function (dataPoints) {

        var parameters = [0];

        var totalLength = 0;
        var l = [];

        for (var k = 0; k < dataPoints.length - 1; k++) {

            var distanceK = math.
                distance(
                { pointOneX: dataPoints[k].X, pointOneY: dataPoints[k].Y },
                { pointTwoX: dataPoints[k + 1].X, pointTwoY: dataPoints[k + 1].Y });

            totalLength += distanceK;
            l.push(totalLength);
        }

        for (var k = 0; k < dataPoints.length - 1; k++) {
            parameters.push(l[k] / totalLength);
        }

        return parameters;

    }

    self.centripetalMethod = function (dataPoints, a) {

        var parameters = [0];

        var n = dataPoints.length - 1;
        var totalLength = 0;
        var l = [];

        parameters[0] = 0;

        for (var k = 1; k <= n; k++) {

            var length = math.
                distance(
                { pointOneX: dataPoints[k].X, pointOneY: dataPoints[k].Y },
                { pointTwoX: dataPoints[k - 1].X, pointTwoY: dataPoints[k - 1].Y });

            var distanceK = math.pow(length, a);

            totalLength += distanceK;
            l.push(totalLength);
        }

        for (var k = 0; k < n; k++) {
            parameters.push(l[k] / totalLength);
        }

        parameters[n] = 1;

        return parameters;

    }

    return self;

}();

