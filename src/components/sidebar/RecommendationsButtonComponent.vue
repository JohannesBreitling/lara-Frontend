<script setup lang="ts">

import router from '../../router';
import LaraButton from "@/components/basic/LaraButton.vue";

// Method to navigate to the recommendations
let navigateToRecommendations = (): void => {
    router.push({ name: 'recommendations' });
}

</script>


<template>
    <lara-button type="primary" @click="navigateToRecommendations" id="sidebar-recommendations-button">
        {{ $t('sidebar.recommendationsButton') }}
    </lara-button>
</template>