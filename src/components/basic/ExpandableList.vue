<template>
    <div @click="toggleExpanded" class="lara-collapse-div" id="toggle-expand">
        <span class="text-h5" :class="hidden ? 'lara-hidden-link' : ''">
            <v-icon icon="mdi-menu-right" class="px-2" :class="state.expanded ? 'rotate' : ''" />
            {{ title }}
            <v-icon :icon="icon" v-show="hidden" class="ml-2" size="25"/>
        </span>
    </div>

    <v-expand-transition>
        <div v-if="state.expanded">
            <v-list transition="scroll-y-transition">
                <slot></slot>
                <v-list-item>
                    <v-divider></v-divider>
                </v-list-item>
            </v-list>
        </div>
    </v-expand-transition>
</template>


<script setup lang="ts">
import { reactive } from "vue";

const props = defineProps({
    title: String,
    expanded: { type: Boolean, required: false },
    icon: { type: String, required: false },
    hidden: { type: Boolean, required: false }
})

let state = reactive({
    expanded: props.expanded
});

let toggleExpanded = (): void => {
    state.expanded = !state.expanded;
}

</script>


<style scoped>
.lara-collapse-div {
    color: #000;
}

.lara-collapse-div:hover {
    cursor: pointer;
}

.v-icon {
    transition: transform .3s ease-out;
}

.rotate {
    transform: rotate(90deg);
}

</style>