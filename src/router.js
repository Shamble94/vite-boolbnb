import { createWebHistory, createRouter } from "vue-router";
import ApartmentDetails from "./components/ApartmentDetails.vue";
import MessageForm from "./components/MessageForm.vue"
import AppMain from "./components/AppMain.vue";
// import MessageForm from './components/MessageForm.vue';
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
        {
         path: '/message-form',
            name: 'MessageForm', // Name of the route
             component: MessageForm, // Component for the message form
          },
        
    ]
});

export { router };
