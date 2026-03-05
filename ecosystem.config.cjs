module.exports = {
  apps: [
    {
      name: 'artys-fans',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        SUPABASE_URL: 'https://jsfprovgkpuymqgjqdsd.supabase.co',
        SUPABASE_ANON_KEY: 'sb_publishable_aMzLC42lzXBK5x7wKM6FJw_mrR1SZXP',
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
    }
  ]
}
