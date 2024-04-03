import { createWebHistory, createRouter } from "vue-router";
import ApartmentDetails from "./components/ApartmentDetails.vue";
import AppMain from "./components/AppMain.vue";
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "app-main",
            component: AppMain
        },
        {
            path: "/apartments/:id",
            name: "ApartmentDetails",
            component: ApartmentDetails
        },    
    ]
});

export { router };
