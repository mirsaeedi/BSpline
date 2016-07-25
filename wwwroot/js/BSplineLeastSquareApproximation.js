﻿var BSplineLeastSquareApproximation = function(dataPoints,
p,
h,
parameterSelectionMethodName,
knotSelectionMethodName,
compressParameters) {

    var n = dataPoints.length - 1;
    var parameters =[];
    var knots =[];

    if(parameterSelectionMethodName=='universal'){
        h=dataPoints.length-1;
        var result = parameterSelectionMethods.getParameters(dataPoints,p,h,parameterSelectionMethodName);
        parameters=result.parameters;
        knots=result.knots;
    }
    else{

        parameters = parameterSelectionMethods.getParameters(dataPoints,p,h,parameterSelectionMethodName);
        var compressionResult = null;
    
        if(compressParameters){
            var compressor = new ParameterCompressor();
            compressionResult = compressor.compress(20,parameters);
            parameters=compressionResult.compressedParameters;
        }

        knots = knotVectorSelectionMethods.getKnots(dataPoints,p,h,parameters,knotSelectionMethodName);
    }

    this.compute = function() {

        var Q = computeQ();
        var N = computeN();
        var NT = math.transpose(N);
        var NTN = math.multiply(NT, N);

        var qX = [];
        var qY = [];

        for (var i = 0; i < h-1; i++) {
            qX.push(Q[i].x);
            qY.push(Q[i].y);
        }

        try{

            var pX = math.lusolve(NTN, qX);
            var pY = math.lusolve(NTN, qY);


            var controlPoints = [dataPoints[0]];
<<<<<<< HEAD

            for (var j = 0; j < h-1; j++) {
                controlPoints.push(new Point(pX[j][0],pY[j][0]));
            }

            controlPoints.push(dataPoints[n]);

            var error = computeErrors(controlPoints,knots,parameters);

            return { cp: controlPoints, knots: knots
                , params : parameters,error:error,order:p,compression:compressionResult};
=======

            for (var j = 0; j < h-1; j++) {
                controlPoints.push(new Point(pX[j][0],pY[j][0]));
            }

            controlPoints.push(dataPoints[n]);

            var error = computeErrors(controlPoints,knots,parameters);

            return { cp: controlPoints, knots: knots, params : parameters,error:error,order:p };
>>>>>>> 5d4079d32faa3bd606bac5b28688061c88de6fb6
        }
        catch(e){
            return { cp: [], knots: [], params : [],error:"singular matrix",order:p };
        }

    }

    function computeErrors(controlPoints, knots, parameters) {

        var result = {
            distances: [],
            minDistance: 10000,
            maxDistance: 0,
            totalDistance: 0,
            totalLeastSquareDistance: 0
        };

        var algorithm = new CoxDeboorAlgorithm(controlPoints, knots, p);

        for (var i = 1; i < parameters.length-1; i++) {

            var curvePoint = algorithm.compute(parameters[i]);
            var distance = math.distance({ pointOneX: curvePoint.x, pointOneY: curvePoint.y },
                { pointTwoX: dataPoints[i].x, pointTwoY: dataPoints[i].y });

            result.distances.push(distance);

            if (distance < result.minDistance)
                result.minDistance = distance;

            if (distance > result.maxDistance)
                result.maxDistance = distance;

            result.totalDistance += distance;

            result.totalLeastSquareDistance += math.square(distance);
        }

        return result;
    }

    function computeQ() {

        var Q = [];

        var basisFunction = new BasisFunction(knots);

        for (var i = 1; i < h; i++) {

            var sumX = 0;
            var sumY = 0;

            for (var k = 1; k < n; k++) {

                var basis = basisFunction.compute(parameters[k], i, p);
                var qK = computeqk(k);
                sumX +=  basis * qK.x;
                sumY += basis * qK.y;
            }

            Q.push(new Point(sumX, sumY));
        }

        return Q;
    }

    function computeqk(k) {
        
        var basisFunction = new BasisFunction(knots);
        var basisZero = basisFunction.compute(parameters[k], 0, p);
        var basisH = basisFunction.compute(parameters[k], h, p);

        var x = math.bignumber(dataPoints[k].x).minus(
            basisZero.times(math.bignumber(dataPoints[0].x).minus(basisH.times(math.bignumber(dataPoints[n].x));

        var y = dataPoints[k].y
            - basisZero * dataPoints[0].y - basisH * dataPoints[n].y;

        return new Point(x, y);
    }

    function computeN() {

        var N = [];

        var basisFunction = new BasisFunction(knots);

        for (var i = 1; i < n; i++) {

            N[i-1] = [];

            for (var j = 1; j < h; j++) {

                N[i-1].push(basisFunction.compute(parameters[i],j,p));
            }
        }

        return N;
    }

}