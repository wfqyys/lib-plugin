import setting from './utils/setting.js'
import lodash from 'lodash'
import { pluginResources } from './utils/path.js'
import path from 'path'

// 支持锅巴
export function supportGuoba () {
  let allGroup = []
  Bot.gl.forEach((v, k) => { allGroup.push({ label: `${v.group_name}(${k})`, value: k }) })
  return {
    pluginInfo: {
      name: 'lib-plugin',
      title: 'lib插件',
      author: '@yys',
      authorLink: 'https://github.com/wfqyys',
      link: 'https://github.com/wfqyys/lib-plugin',
      isV3: true,
      isV2: false,
      description: '提供长江大学图书馆位置自动预约功能',
      icon: 'bi:box-seam',
      iconColor: '#7ed99e',
      iconPath: path.join(pluginResources, 'common/logo.jpg')
    },
    // 配置项信息
    configInfo: {
      // 配置项 schemas
      schemas: [{
        component: 'Divider',
        label: '通用设置'
      },
      {
        field: 'Help.renderScale',
        label: '渲染精度',
        bottomHelpMessage: '设置插件的渲染精度，可选值50~200，建议100。设置高精度会提高图片的精细度，但因图片较大可能会影响渲染与发送速度',
        component: 'InputNumber',
        required: true,
        componentProps: {
          min: 0,
          max: 10000,
          placeholder: '请输入数字'
        }
      },
      
      {
        field: 'gccfg.recall.disable_group',
        label: '禁用群号',
        bottomHelpMessage: '禁用选座功能的群',
        component: 'Select',
        componentProps: {
          allowAdd: true,
          allowDel: true,
          mode: 'multiple',
          options: allGroup
        }
      }
      ],
      getConfigData () {
        return setting.merge()
      },
      // 设置配置的方法（前端点确定后调用的方法）
      setConfigData (data, { Result }) {
        let config = {}
        for (let [keyPath, value] of Object.entries(data)) {
          lodash.set(config, keyPath, value)
        }
        config = lodash.merge({}, setting.merge, config)
        setting.analysis(config)
        return Result.ok({}, '保存成功~')
      }
    }
  }
}
