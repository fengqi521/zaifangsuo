// 固件包列表
import { getRequest,postRequest } from "@/utils/request";

export default {
    getPackageList:(params)=>{
        return getRequest('/v1/upgrade/packages')
    },
    postPackage:(params,config)=>{
        return postRequest('/v1/upgrade/upload',params,config)
    },
    deletePackage:(params)=>{
        return postRequest('/v1/upgrade/remove',params)
    }
}