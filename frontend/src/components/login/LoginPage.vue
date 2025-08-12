<template>
    <div class="login-main-container">
        <div v-if="isLogin" class="login-menu">
            <h3>Log in</h3>
            <form @submit.prevent="handleSubmit">
                <div class="form-row">
                    <label for="">User name</label>
                    <input type="text"  v-model="form.name" >
                </div>
                <div class="form-row">
                    <label for="">Password</label>
                    <input type="text" v-model="form.password">
                </div>
                <div v-show="error">
                    <p>{{errorMessage}}</p>
                </div>
                <div class="form-row">
                    <button type="submit">Log in</button>
                    <button @click="onReg">Create user</button>
                </div>
            </form>
        </div>
        <div v-else class="login-menu">
            <h3>Register</h3>
            <form @submit.prevent="registerUser">
                <div class="form-row">
                    <label for="">User name</label>
                    <input type="text" v-model="form.name" >
                </div>
                <div class="form-row">
                    <label for="">Password</label>
                    <input type="text" v-model="form.password">
                </div>
                <div v-show="error">
                    <p>{{errorMessage}}</p>
                </div>
                <div class="form-row">
                    <button type="submit">Register</button>
                    <button @click="onReg">Log in</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { computed, ref } from "vue";
    import { api } from '@/components/api/api.ts'
    import { useLoginStore } from '@/store/useLoginStore.ts'
    import { storeToRefs } from "pinia";

// ---------------------store
    const loginStore = useLoginStore()
    const { login, userLS } = storeToRefs(loginStore)
    const { writeUserToLS, readUserFromLS, removeUserFromLS } = loginStore
// ---------------------
    const isLogin = ref(true)
    const form = ref({
        name: '',
        password: '',
    })

    const error = ref(false)
    let errorMessage = ''

    function onReg() {
        isLogin.value = !isLogin.value;
        form.value = { name: '', password: '' };
        
        error.value = false
    }

    async function registerUser() {
        const data = {
            ...form.value,
        }
        error.value = false

        if (data.name.length < 1 ) {
            errorMessage = 'User name is empty'
            error.value = true
            return 
        }

        if (data.password.length < 6 ) {
            errorMessage = 'Password must be longer or equal 6'
            error.value = true
            return 
        }

        try {
            const response = await api.post('userData/createUser', {
                name: data.name,
                password: data.password,
            })
            
            return response
        } catch (error) {
            console.log('Register error: ' + error.message);
        } finally {
            error.value = false
        }
        onReg()
    }

    async function handleSubmit() {
        const data = {
            ...form.value,
        }

        readUserFromLS()

        try {
            if (userLS) {
                removeUserFromLS();
            }

            const response = await api.post('userData/login', {
                name: data.name,
                password: data.password,
            })
            error.value = false
            writeUserToLS(response.data)
            return response
        } catch (err) {
            error.value = true
            errorMessage = 'Invalid credentials'

            console.log('Log in error: ' + err.message);
        }
    }
</script>

<style scoped>
    .login-main-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: lightgray;
    }

    .login-menu, form {
        display: grid;
        grid-template-rows: 0.1fr 1fr;
        gap: 15px;
    }

    .login-menu {
        max-width: 30vw;
        max-height: 30vh;
        border: 2px solid black;
        border-radius: 5px;
        padding: 10px;
        background-color: white;
    }

    .form-row {
        display: flex;
        justify-content: space-between;
    }

    label {
        margin-right: 20px;
    }

    button {
        width: 100px;
        height: 30px;
        border: 1px solid black;
        border-radius: 5px;
    }

    button:first-child {
        background-color: lightgreen;
    }

    p {
        color: red;
    }
</style>