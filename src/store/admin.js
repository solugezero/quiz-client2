import { acceptHMRUpdate, defineStore } from "pinia";

export const useAdminStore = defineStore("admin", () => {
    const questions = ref([]);
    const answers = ref([]);

    return {
        questions,
        answers
    }
});

if (import.meta.hot)
    import.meta.hot.accept(acceptHMRUpdate(useAdminStore, import.meta.hot));
