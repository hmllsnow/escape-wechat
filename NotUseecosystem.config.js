module.exports = {
    apps: [
      {
        name: 'background',
        script: '/EscapeWechat/background/index.js',
        instances: 1,
        exec_mode: 'fork',
        env: {
          NODE_ENV: 'production',
        },
        // 您可以在这里添加更多配置，如自动重启、监控等
      },
      {
        name: 'front',
        cwd: '/EscapeWechat/frontground',
        script: 'node',
        args: 'start.js',
        exec_mode: 'fork',
      },
      // 如果需要，可以为 bot 和 frontground 也设置相应的应用配置
    ],
  };