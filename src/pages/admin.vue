<script setup>
import { gameAxios, questionsGet, questionCreate, answerCreate, answersGet } from '~/api';

const adminStore = useAdminStore();
const { questions, answers } = storeToRefs(adminStore);

useHead({
	title: "admin page",
});

onMounted(async () => {
	const password = await prompt('Enter password (ultra bezopasnost from hackers):');
	const result = await gameAxios.get(`/api/v1/password?passphrase=${password}`);
	console.log(result)
	if (!result.success) {
		window.location.reload();
		return;
	}

	questions.value = await questionsGet();
	answers.value = await answersGet();
})

const sortedQuestions = computed(() => questions.value.sort((a, b) => a.id - b.id))

const createQuestion = async () => {
	const result = await questionCreate({
		type: 'POSITION'
	});
	if (!result) {
		return;
	}
	console.log(result)

	questions.value.push(result);
}

const getQuestions = async () => {
	questions.value = await questionsGet();
}
</script>

<template>
	<p>АДМИНИСТРАТИВНАЯ ПАНЕЛЬ</p>
	<div class="flex flex-wrap gap-18px scroll-y px-20px">
		<div v-for="question in sortedQuestions" class="w-[calc(100%/3-20px)]">
            <AdminQuestion :question="question" @sync="getQuestions" />
		</div>
	</div>
	<button @click="createQuestion">Добавить еще один вопрос</button>
</template>

<style scoped lang="scss">
</style>
