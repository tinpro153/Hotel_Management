import { createWebHistory,createRouter } from "vue-router";
import Home from "@/components/HomeComponent.vue";
import ProductDetail from "@/components/ProductDetail.vue";

// tạo một mảng chứa các đối tượng routes
const routes=[
    // trang chủ thì có đường dẫn là / và component là Home
    {
        path:"/",
        name:"Home",
        component:Home
    },
    {
        path:"/product/:id",
        name:"ProductDetail",
        component:ProductDetail
    },
  
];
// tạo một đối tượng router bằng cách sử dụng createRouter 
// và truyền vào các routes đã tạo ở trên
const router=createRouter({
    history:createWebHistory(),
    routes:routes
}); 
export default router;