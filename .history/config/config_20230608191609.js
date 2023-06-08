import fs from 'fs'
import lodash from 'lodash'

const defaultConfig = {
    version : '1.0.1',
}
const _path = process.cwd()
let config = {}
if (fs.existsSync(`${_path}/plugins/lib-plugin/config/config.json`)) {
  const fullPath = fs.realpathSync(`${_path}/plugins/lib-plugin/config/config.json`)
  const data = fs.readFileSync(fullPath)
  if (data) {
    try {
      config = JSON.parse(data)
    } catch (e) {
      logger.error('lib插件读取配置文件出错，请检查config/config.json格式，将忽略用户配置转为使用默认配置', e)
    }
  }
}
config = Object.assign({}, defaultConfig, config)
config.version = defaultConfig.version

