const base = {
    get() {
        return {
            url : "http://localhost:8080/qicheweixiuguanli/",
            name: "qicheweixiuguanli",
            // 退出到首页链接
            indexUrl: 'http://localhost:8080/qicheweixiuguanli/front/index.html'
        };
    },
    getProjectName(){
        return {
            projectName: "汽车维修管理系统"
        } 
    }
}
export default base
