import Icon from '@/components/Icon.vue'
export const iconPlugin = (app)=>{
    app.use({install(app){
        app.component('Icon',Icon)
    }})
    
}

