let chalk = require("chalk");

const column = letter => ({
    value: letter,
    color: "blue",
    width: 3,
    formatter: value => value === 'X' ? chalk.bold.green(value) : value
});

module.exports = [
    {
        "value": "",
        "color": "yellow"
    },

    column("A"),
    column("B"),
    column("C"),
    column("D"),

    column("E"),
    column("F"),
    column("G"),
    column("H")
];

