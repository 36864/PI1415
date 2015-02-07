var configs = {
    "development": {
        getConnString: function()
        {
            return "postgres://todonanetuser:todonanetuserpassword@localhost/todonanet";
        }
    }
}

var config = configs[process.env.NODE_ENV] || configs["development"];

console.log("using config", config);


module.exports = config;
