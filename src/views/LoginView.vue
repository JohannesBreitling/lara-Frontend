<template>
    <v-container id="login-form">
        <h1 class="text-h3 mt-16 text-sm-center font-weight-bold" id="login-title">{{ $t('login.login') }}</h1>

        <div>
            <v-form class="mt-8">
                <v-text-field class="lara-field" variant="outlined" :label=" $t('login.username') "
                                v-model="loginData.username" @keyup.enter="login" autofocus></v-text-field>
                <v-text-field class="lara-field" variant="outlined" :label=" $t('login.password') " type="password"
                                v-model="loginData.password" @keyup.enter="login"></v-text-field>
                <lara-button type="primary" id="login-button" @click="login">{{ $t('login.button') }}</lara-button>
            </v-form>
        </div>

        <div class="mt-4">
            <v-alert v-if="loginData.loginFailed" type="error" prominent variant="elevated">
                {{ $t('errorMsg.falseLoginData') }}
            </v-alert>
        </div>
    </v-container>
</template>


<script setup lang="ts">

import {reactive} from 'vue';
import LaraButton from '@/components/basic/LaraButton.vue';
import {AuthApiHandler} from '@/api/Auth/AuthApiHandler';
import router from '@/router';
import {useCurrentUserStore} from '@/stores/currentUser';
import {i18n} from "@/internationalization/i18n";

document.title = i18n.global.t("pageTitles.login") + " - lara";

let loginData = reactive({
    username: "",
    password: "",
    loginFailed: false
});


async function login() {
    const [token, user] = await AuthApiHandler.login(loginData.username, loginData.password);
    if (token === undefined && user === undefined) {
        loginData.loginFailed = true;
        return;
    }

    // parse token
    let tokenPayload = JSON.parse(atob(token.split('.')[1]));
    let expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + tokenPayload.exp);
    let isAdmin = tokenPayload.admin;
    
    // create cookie for token
    document.cookie = "lara-token=" + token + ";expires=" + expiryDate.toUTCString(); + ";path=/";

    // store user
    useCurrentUserStore().setCurrentUser(user);
    useCurrentUserStore().setAdmin(isAdmin);

    router.push({ name: 'home'});
}

</script>


<style scoped>

#login-form {
    width: 300px;
}

</style>
