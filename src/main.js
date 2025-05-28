import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
// import "./assets/app.css";
// import "./assets/main.css";
import {createApp} from "vue";
import App from "./App.vue";
// import ChildComp from "@/components/ChildComp.vue";
// import router from "./router";
import {createPinia} from "pinia";


createApp(App)
    // .component("ChildComp", ChildComp)
    // .use(router).use(createPinia())
    // .use(i18n)
    .mount("#app");