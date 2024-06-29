import moment from 'moment'

/**
 * 获取本机时间
 * @returns 
 */
export const getCurrentTime = () => {
    return moment().format("YYYY-MM-DD hh:mm:ss");
};


/** 用 JS 获取全局 css 变量 */
export const getCssVariableValue = (cssVariableName) => {
    let cssVariableValue = ""
    try {
        cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
    } catch (error) {
        console.error(error)
    }
    return cssVariableValue
}