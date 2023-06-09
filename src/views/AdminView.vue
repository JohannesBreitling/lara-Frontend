<template>
    <v-container id="container" class="w-75">
        <h1 class="text-h3 font-weight-bold" id="admin-greeting">
            {{ $t('admin.greeting', { name: state.currentUser?.username }) }}
        </h1>

        <div v-if="!state.loading && state.categories != undefined" class="d-flex flex-row gap-8 mt-8">
            <user-dialog :button-text="$t('admin.userDialog.buttonCreate')" :password-change="false"
                         :user-categories="state.categories"
                         @save="(username, category, password) => onCreateUser(username, category, password)">
                <lara-button type="primary" id="create-user-button" class="w-100">
                    {{ $t('admin.createUser') }}
                </lara-button>
            </user-dialog>

            <router-link :to="{ name: 'userCategories' }" class="lara-no-decoration">
                <lara-button type="secondary" id="create-category-button" class="w-100">
                    {{ $t('admin.editCategories') }}
                </lara-button>
            </router-link>
        </div>

        <h2 class="text-h4 font-weight-bold mt-8" id="admin-user-overview">
            {{ $t('admin.userOverview') }}
        </h2>

        <div class="mt-4" v-if="state.loading">
            <v-progress-circular indeterminate size="70"></v-progress-circular>
        </div>


        <div class="mt-4" v-if="!state.loading">
            <organizable-list :slots="[{ id: 'users', key: 'users' }]" :organize-slots="organizeSlots"
                              :selected-organizers="organizerState.selectedOragnizers" @organize="onOrganize"
                              @remove-organizer="(name) => onRemoveOrganizer(name)">
                <template v-slot:users v-if="state.users != undefined && state.categories != undefined">
                    <user-card v-for="(user, index) in state.users" :user="user" :key="index" :deletable="true"
                               @delete="onDeleteUser(user)" :user-categories="state.categories"
                               @update="(username, category, password) => onUpdateUser(user, username, category, password)">
                    </user-card>
                </template>

                <template v-slot:category-filter>
                    <div id="tag-select" class="mt-4">
                        <v-select class="lara-field" :label="$t('admin.organize.userCategories')"
                                  variant="outlined" :items="userCategoriesStrings" multiple clearable v-model="organizerState.tags">
                            <template v-slot:selection="{ item, index }">
                                <v-chip class="lara-chip" :color="state.categories?.filter(category => category.name === item.title)[0].color">
                                    {{ item.title }}
                                </v-chip>
                            </template>
                        </v-select>
                    </div>
                </template>
            </organizable-list>
        </div>
    </v-container>
</template>


<script setup lang="ts">

import {computed, reactive} from "vue";
import {i18n} from "@/internationalization/i18n";

import LaraButton from "@/components/basic/LaraButton.vue";
import OrganizableList from "@/components/basic/OrganizableList.vue";
import UserCard from "@/components/cards/UserCard.vue";
import UserDialog from "@/components/dialogs/UserDialog.vue";

import type {User} from "@/model/User";
import type {UserCategory} from "@/model/UserCategory";
import {Organizer} from "@/model/Organizer";

import {useCurrentUserStore} from "@/stores/currentUser";
import {AdminApiHandler} from "@/api/Admin/AdminApiHandler";

// Set the document title
document.title = i18n.global.t("pageTitles.admin") + " - lara";

const organizeSlots = [{ id: "category-filter", name: "Tags", key: "tagFilter" }];

const userCategoriesStrings = computed<string[]>(() => {
    let strings: string[] = [];
    for (let userCategory of state.categories) {
        strings.push(userCategory.name)
    }
    return strings;
})

let state: { loading: boolean, users: User[], categories: UserCategory[], currentUser: User | null, index: number } = reactive({
    loading: true,
    currentUser: useCurrentUserStore().currentUser,
    users: [],
    index: 0,
    categories: [],
});

let organizerState: { tags: string[], selectedOragnizers: Organizer[] } = reactive({
    tags: [],
    selectedOragnizers: []
});

let getUsers = async (organizers: Organizer[]) => {
    state.loading = true;
    let users = await AdminApiHandler.getUsers(organizers);
    state.users = users;

    console.log(users);
    state.loading = false;
}

let getCategories = async () => {
    let response = await AdminApiHandler.getUserCategories();
    state.categories = response;
}
 


function onCreateUser(username: string, userCategory: UserCategory, password?: string) {
    if (!username || !password || !userCategory) {
        if (!username) console.error("Username was not defined");
        if (!password) console.error("Password was not defined");
        if (!userCategory) console.error("User Category was not defined");
        return;
    }

    AdminApiHandler.createUser(username, password, userCategory);

    state.loading = true;
    setTimeout(() => {
        getUsers(organizerState.selectedOragnizers);
    }, 300);
}

async function onDeleteUser(user: User) {
    state.users.splice(state.users.indexOf(user), 1);
    await AdminApiHandler.deleteUser(user);

    state.loading = true;
    setTimeout(() => {
        getUsers(organizerState.selectedOragnizers);
    }, 300);   
}

async function onUpdateUser(user: User, newName: string, newUserCategory: UserCategory, newPassword?: string) {
    user.username = newName;
    user.userCategory = newUserCategory;
    if (newPassword == undefined) {
        await AdminApiHandler.updateUser(user, newName, user.password, newUserCategory);
    } else {
        await AdminApiHandler.updateUser(user, newName, newPassword, newUserCategory);
        user.password = newPassword;
    }

    getUsers(organizerState.selectedOragnizers);
}

// Helper methods for organizers
function onOrganize() {
    // clear currently selected oranizers
    organizerState.selectedOragnizers = [];

    let tagsEmpty = (organizerState.tags.length == 0);

    // build tags organizer
    let tagsValue = "";
    let separator = "";
    organizerState.tags.forEach(element => {
        tagsValue += separator;
        tagsValue += element;
        
        separator = ",";
    });

    if (!tagsEmpty) {
        let tagsFilter = new Organizer("category-filter", tagsValue);
        organizerState.selectedOragnizers.push(tagsFilter);
    }

    getUsers(organizerState.selectedOragnizers);
}

function onRemoveOrganizer(name: string) {
    let newOrganizers = organizerState.selectedOragnizers.filter((organizer) => {
        return name !== organizer.name;
    });

    // Reset the selected tags
    organizerState.tags = [];

    organizerState.selectedOragnizers = newOrganizers;

    getUsers(organizerState.selectedOragnizers);
}

// Fetch the categories and the users on pageload
getCategories();
getUsers([]);
state.loading = false;

</script>


<style>

#container {
    min-width: 300px;
}

#create-user-button {
    max-width: 250px;
    min-width: 150px;
}

#create-category-button {
    min-width: 250px;
}

#tag-select {
    width: 100%;
    min-width: 250px;
    max-width: 350px;
}

</style>