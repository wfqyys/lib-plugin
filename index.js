import fs from 'node:fs'
import { version} from './config/config.js'

if (!global.segment) {
  global.segment = (await import("oicq")).segment
}

if (!global.core) {
  try {
    global.core = (await import("oicq")).core
  } catch (err) {}
}

const files = fs.readdirSync('./plugins/lib-plugin/apps').filter(file => file.endsWith('.js'))

let ret = []

logger.info('**************************************')
logger.info('lib-plugin加载成功')
logger.info(`当前版本${version}`)
logger.info('仓库地址 https://github.com/wfqyys/lib-plugin')
logger.info('Create By YYS')
logger.info('**************************************')

files.forEach((file) => {
  ret.push(import(`./apps/${file}`))
})

ret = await Promise.allSettled(ret)

let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')

  if (ret[i].status != 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    continue
  }
  apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
}
export { apps }

