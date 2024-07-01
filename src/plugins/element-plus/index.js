import ElementPlus from 'element-plus'
import zhCn from "element-plus/es/locale/lang/zh-cn";
export const  loadElementPlus = (app)=>{
    app.use(ElementPlus,{locale:zhCn})
}