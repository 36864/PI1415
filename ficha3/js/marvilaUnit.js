/*global document, console */
/*jshint strict: true */
/* sloopy: true */

var $mu = {
    newList: null,

    assert: function a(condition, msg) {
    /*
        var newLi = document.createElement("li");
        var text = document.createTextNode(msg);
        newLi.appendChild(text);
        newList.appendChild(newLi);
        */
        var value; 
        if(typeof condition !== 'function') {
            value = condition;
            
        } else {
            value = condition();
            msg = condition.toString();
            msg = msg.substring(msg.indexOf("return")+"return".length+1, msg.lastIndexOf(";"));
        }
        var newLi = document.createElement("li");
        this.newList.appendChild(newLi);
        newLi.appendChild(document.createTextNode(msg));
        newLi.className = value ? "passed" : "failed";
    },

    test: function t(testName, fn) {
        "use strict";
        console.log("This object is: " + this);
        var results = document.getElementById("results");
        if (results === null) {
            results = document.createElement("div");
            results.id = "results";
            document.body.appendChild(results);
        }
        console.log(results);
        this.newList = document.createElement("ul");
        results.appendChild(this.newList);
        this.assert(true, "###" + testName + "###");
        fn();
    }
};

$mu.assert = $mu.assert.bind($mu);
$mu.test = $mu.test.bind($mu);

