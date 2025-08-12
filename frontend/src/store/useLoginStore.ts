import { defineStore } from "pinia";
import { ref } from 'vue';

export const useLoginStore = defineStore('useLoginStore', () => {
    const login = ref(false);
    const keyLS = 'user';
    const userLS = ref();

    function writeUserToLS(data) {
        localStorage.setItem(keyLS, JSON.stringify({ ...data }));
        userLS.value = data;
        login.value = true;
    }

    function readUserFromLS() {
        const stored = localStorage.getItem(keyLS);
        if (stored) {
            userLS.value = JSON.parse(stored);
            login.value = true;
        } else {
            userLS.value = null;
            login.value = false;
        }
    }

    function removeUserFromLS() {
        localStorage.removeItem(keyLS);
        userLS.value = null;
        login.value = false;
    }


    readUserFromLS();// auto check when init

    return {
        login,
        userLS,
        writeUserToLS,
        readUserFromLS,
        removeUserFromLS,
    };
});
