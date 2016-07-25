﻿var CoxDeboorAlgorithm = function(controlPoints, knots, bsplineOrder) {

    //var bsplineOrder=bsplineOrder+1;



    this.compute = function(t) {

        var indexOfRange = findRangeIndex(t);

        var d=[];

        for(var i=0;i<=bsplineOrder;i++){
            
            var downIndex = indexOfRange-bsplineOrder+i;

            if (downIndex > -1 && downIndex < controlPoints.length)
               d.push(controlPoints[downIndex]);
            else
                d.push( new Point(0, 0));
        }
                    

        for (var r = 1; r <= bsplineOrder; r++) {
            
            for (var i = indexOfRange - bsplineOrder + r; i <=indexOfRange; i++) {
                
                var alpha = (t-knots[i])/( knots[i+bsplineOrder-r+1] - knots[i])
                
                var x = d[i - (indexOfRange - bsplineOrder + r)].x * (1-alpha) 
                +d[i - (indexOfRange - bsplineOrder + r) + 1].x * alpha;

                var y = d[i - (indexOfRange - bsplineOrder + r)].y * (1-alpha) 
                +d[i - (indexOfRange - bsplineOrder + r) + 1].y * alpha;

                d[i - (indexOfRange - bsplineOrder + r)]=new Point(x,y);
            }
        }

        return d[0];
    }
    /*
    var memoization = null;
    
    this.compute = function(t) {

        var rangeIndex = findRangeIndex(t);

        memoization = [];

        for (var i = 0; i < bsplineOrder; i++) {
            memoization[i] = [];
            for (var j = 0; j < rangeIndex + 1; j++) {
                memoization[i][j] = null;
            }
        }

        return innerCompute(bsplineOrder - 1, rangeIndex, t);
    }

    var innerCompute = function(upIndex, downIndex, t) {

        if (upIndex === 0) {

            if (downIndex > -1 && downIndex < controlPoints.length)
                return controlPoints[downIndex];
            else
                return new Point(0, 0);

        }

        var cache = null;
        if ((cache = isValueComputedBefore(upIndex, downIndex)) != null)
            return cache;

        var proportion = getProportion(upIndex, downIndex, t);

        var first = innerCompute(upIndex - 1, downIndex - 1, t);
        var second = innerCompute(upIndex - 1, downIndex, t);

        var x = ((1 - proportion) * first.x) + (proportion * second.x);
        var y = ((1 - proportion) * first.y) + (proportion * second.y);

        var result = new Point(x, y);

        memoization[upIndex][downIndex] = result;

        return result;

    }

    var isValueComputedBefore = function(i, j) {
        return memoization[i][j];
    }

    var getProportion = function(j, i, t) {

        return (t - knots[i]) / (knots[i - j + bsplineOrder] - knots[i]);

    }*/
    

        var findRangeIndex = function(t) {

        for (var i = 1; i < knots.length; i++) {

            if (knots[i] > t)
                return i - 1;
        }
    }
}