import {loadElementPlus} from './element-plus'
import {iconPlugin} from './icon'
export const loadPlugins = (app)=>{
    loadElementPlus(app)
    iconPlugin(app)
}