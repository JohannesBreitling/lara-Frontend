<template>
    <div @click="state.dialog = true">
        <slot></slot>
    </div>
    <v-dialog id="dialog" v-model="state.dialog">
        <v-card>
            <v-card-title></v-card-title>
            <v-card-text>
                <v-form v-model="valid">
                    <div class="d-flex flex-column gap-4">
                        <v-text-field class="lara-field" variant="outlined"
                                      v-model="state.username" :counter="32"
                                      :label="$t('admin.userDialog.username')"></v-text-field>
                        <v-text-field class="lara-field" variant="outlined" type="password"
                                      v-model="state.password" :counter="256"
                                      :label="passwordChange ? $t('admin.userDialog.passwordNew') : $t('admin.userDialog.password')">
                        </v-text-field>
                        <v-select class="lara-field" :label="$t('admin.userDialog.userCategory')"
                                  variant="outlined" :items="userCategoriesString" v-model="state.userCategory">
                            <template v-slot:selection="{ item, index }">
                                <v-chip class="lara-chip" :color="userCategories.filter(category => category.name === item.title)[0].color">
                                    {{ item.title }}
                                </v-chip>
                            </template>
                        </v-select>
                    </div>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-container>
                    <lara-button type="primary" @click="closeDialog" id="user-dialogue-close-button">
                        {{ buttonText }}
                    </lara-button>
                </v-container>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>


<script setup lang="ts">
import type {User} from "@/model/User";
import {computed, reactive} from "vue";
import LaraButton from "@/components/basic/LaraButton.vue";
import type {UserCategory} from "@/model/UserCategory";

let valid = false;

const props = defineProps<{
    user?: User,
    userCategories: UserCategory[],
    buttonText: string,
    passwordChange: boolean
}>();

const userCategoriesString = computed<string[]>(() => {
    let strings: string[] = [];
    for (let userCategory of props.userCategories) {
        strings.push(userCategory.name)
    }
    return strings;
})

const emit = defineEmits<{
    (event: "save", username: string, userCategory: UserCategory, password?: string): void
}>();

let state = reactive({
    dialog: false,
    username: props.user == undefined ? '' : props.user.username,
    password: '',
    userCategory: props.user == undefined ? null : props.user.userCategory.name,
    test: [''],
});
function closeDialog() {
    state.dialog = false
    console.debug("Dialog closed emitting save event");
    let userCategory = props.userCategories.filter(category => category.name == state.userCategory)[0];
    console.log(props.userCategories)
    console.log(userCategory);

    if (state.password != '') {
        emit("save", state.username, userCategory, state.password);
    } else {
        emit("save", state.username, userCategory);
    }
}
</script>


<style scoped>
#dialog {
    min-width: 300px;
    max-width: 750px;
    border-radius: 0;
}
</style>