module.exports = {
    apps: [

      {
        name: 'front',
        cwd: './',
        script: 'node',
        args: 'start.js',
        
      },
      // 如果需要，可以为 bot 和 frontground 也设置相应的应用配置
    ],
  };