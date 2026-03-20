module.exports = {
  apps: [
    {
      name: 'bnk-digitalit',
      script: 'bash',
      args: '-c "npx wrangler d1 migrations apply DB --local 2>/dev/null; npx wrangler pages dev dist --local --ip 0.0.0.0 --port 3000"',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      cwd: '/home/user/webapp'
    }
  ]
}
