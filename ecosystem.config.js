
module.exports = {
    apps: [
        {
            name: (process.env.ENV_STR ? (process.env.ENV_STR + "-") : "") + 'server',
            script: './dist/main.js',
            watch: false,
            // cwd:"",
            args: '',
            interpreter_args: '',
            // instances:-1,
            env: {
                NODE_ENV: 'development',
            },
        },
        {
            name: (process.env.ENV_STR ? (process.env.ENV_STR + "-") : "") + "queue",
            script: "./dist/queue_processor.js",
            watch: false,
            // cwd:"",
            args: "",
            interpreter_args: "",
            // instances:-1,
            env: {
                NODE_ENV: "development",
            },
        },
    ],
};
