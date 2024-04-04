import { createWebHistory, createRouter } from "vue-router";
import ApartmentDetails from "./components/ApartmentDetails.vue";
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
<<<<<<< HEAD
        // {
        //     path: '/message-form',
        //     name: 'MessageForm', 
        //     component: MessageForm, 
        //   },
=======
        {
            // path: '/message-form',
            // name: 'MessageForm', // Name of the route
            // component: MessageForm, // Component for the message form
          },
>>>>>>> f4daa84ba8ae271faac8c3aeadecaef378a4e852
        
    ]
});

export { router };
