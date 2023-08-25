<script setup>
    import { answerCreate, answersGet, questionUpdate,questionImageUpload, questionsGet, answerUpdate, questionDelete } from '~/api';
    const api = import.meta.env.VITE_API;

    const adminStore = useAdminStore();
    const { answers } = storeToRefs(adminStore);

    const emits = defineEmits(['sync'])
    const props = defineProps({
        question: [Object]
    })

    const answersByQuestion = computed(() => answers.value.filter(v => v.questionId === props.question.id));
    const sortedAnswers = computed(() => answersByQuestion.value.sort((a, b) => a.id - b.id))

    const answerModel = ref({
        title: '',
        isCorrect: false,
        position: ''
    })

    const easyMode = ref(false);

    const createAnswer = async () => {
        if (!answerModel.value.title || answerModel.value.title.length === 0) {
            return;
        }

        const data = questionModel.value.type === 'DEFAULT' ? {
            questionId: props.question.id,
            meta: {
                title: answerModel.value.title,
            },
            isCorrect: answerModel.value.isCorrect
        } : {
            questionId: props.question.id,
            meta: {
                title: answerModel.value.title,
            },
            correctPos: +answerModel.value.position
        }

        const result = await answerCreate(data);
        answerModel.value = {
            title: '',
            isCorrect: false
        }
        answers.value = await answersGet();

        answerModel.value = {
            title: '',
            isCorrect: false,
            position: ''
        }
    }

    const imageCommentModel = ref('')

    const questionEdit = async () => {
        let data = {};
        if (questionModel.value.type === 'DEFAULT') {
            data = {
                meta: {
                    imageComment: imageCommentModel.value,
                    comment: commentModel.value,
                    title: questionModel.value.title,
                    image: questionModel.value.image,
                    easy: easyMode.value
                },
                type: questionModel.value.type
            }
        }
        else if (questionModel.value.type === 'POSITION') {
            data = {
                meta: {
                    imageComment: imageCommentModel.value,
                    comment: commentModel.value,
                    positions: positionModels.value,
                    title: questionModel.value.title,
                    image: questionModel.value.image,
                    easy: easyMode.value
                },
                type: questionModel.value.type
            }
        }
        else if (questionModel.value.type === 'VALUE') {
            data = {
                meta: {
                    imageComment: imageCommentModel.value,
                    comment: commentModel.value,
                    value: valueModel.value,
                    title: questionModel.value.title,
                    image: questionModel.value.image,
                    easy: easyMode.value
                },
                type: questionModel.value.type
            }
        }
        const result = await questionUpdate(props.question.id, data);
        answers.value = await answersGet();
        emits('sync')
    }

    const answerEdit = async (payload) => {
        const result = await answerUpdate(payload.id, payload.data);
    }

    const positionModels = ref([
        {
            position: 1,
            title: ''
        },
        {
            position: 2,
            title: ''
        },
        {
            position: 3,
            title: ''
        },
    ])

    const questionModel = ref({
        title: '',
        image: '',
        answerIds: [],
        type: ''
    });

    const fileUploadHandler = async ({ target }) => {
        const file = target.files[0];
        if (!file) {
            return;
        }

        let formData = new FormData();

        formData.append("file", file);
        for(var pair of formData.entries()) {
            console.log(pair[0]+', '+pair[1]);
        }
        console.log(file, formData.get('file'))
        await questionImageUpload(props.question.id, formData);
        emits('sync')
    }

    const questionDeletes = async () => {
        await questionDelete(props.question.id);
        emits('sync')
    }

    const valueModel = ref([
        {
            question: '',
            answer: ''
        }
    ]);

    const addValueModel = () => {
        console.log(111)
        valueModel.value.push({
            question: '',
            answer: ''
        });
    }

    const removeValueModel = (val) => {
        const index = valueModel.value.findIndex(v => v.question === val.question && v.answer === val.answer);
        if (index === -1) return;
        valueModel.value.splice(index, 1);
    }

    const commentModel = ref('')

    onMounted(() => {
        if (props.question.meta?.positions) {
            positionModels.value = props.question.meta.positions;
        }
        if (props.question.meta?.title) {
            questionModel.value.title = props.question.meta.title;
        }
        if (props.question.meta?.image) {
            questionModel.value.image = props.question.meta.image;
        }
        if (props.question.meta?.comment) {
            commentModel.value = props.question.meta.comment;
        }
        if (props.question.type) {
            questionModel.value.type = props.question.type;
        }

        if (props.question.meta && props.question.type === 'VALUE') {
            valueModel.value = props.question.meta.value;
        }

        easyMode.value = props.question.meta && props.question.meta.easy === undefined ? false : props.question.meta.easy;
    })
</script>
<template>
    <div class="flex flex-col gap-y-10px max-w-680px">
        <p class="h-40px leading-40px text-20px font-800">Title: {{ question.meta?.title }}</p>
        <!-- <img class="image" v-if="questionModel.image && questionModel.image.length > 0" :src="questionModel.image"> -->
        <div class="relative w-full h-256px">
            <img class="image w-full! h-full!" v-if="question.meta?.image" :src="`${api}/${question.meta.image}`">
            <p class="absolute right-20px bottom-20px bg-#ffffff/60">Необходимый размер изображения: 680х256</p>
        </div>
        <TheCheckbox v-model="easyMode"><p>Легкий вопрос</p></TheCheckbox>
        <TheInput v-model="questionModel.title" >
            <template #prepend>
                <p class="pl-4 font-700">Вопрос:</p>
            </template>
        </TheInput>
        <div v-if="questionModel.type === 'POSITION'" class="flex flex-wrap gap-6px">
            <TheInput v-for="position in positionModels" v-model="position.title" class="w-[calc(100%/3-4.5px)]" >
                <template #prepend>
                    <p class="pl-4 font-700">{{ position.position }}:</p>
                </template>
            </TheInput>
        </div>
        <div class="flex justify-between px-40px">
            <p>Тип вопроса:</p>
            <div class="flex gap-x-8px">
                <TheRadio v-model="questionModel.type" value="DEFAULT" />
                <p>Стандартный</p>
            </div>
            <div class="flex gap-x-8px">
                <TheRadio v-model="questionModel.type" value="POSITION" />
                <p>Позиция</p>
            </div>
            <div class="flex gap-x-8px">
                <TheRadio v-model="questionModel.type" value="VALUE" />
                <p>Супер-игра</p>
            </div>
        </div>
        <label>Картинка:</label>
        <input type="file" @change="fileUploadHandler($event)">
        <div v-if="questionModel.type === 'DEFAULT'" class="flex flex-wrap gap-6px">
            <AdminAnswer class="w-[calc(100%/2-3px)]" v-for="answer in sortedAnswers" :answer="answer" @edit="answerEdit($event)" />
            <div class="flex flex-col w-[calc(100%/2-3px)] border-1px border-#000 rounded-5px items-center gap-6px py-6px">
                <TheInput v-model="answerModel.title" />
                <div class="flex gap-x-6px">
                    <p>Правильный ответ:</p>
                    <TheCheckbox v-model="answerModel.isCorrect" />
                </div>
            </div>
            <TheInput placeholder="пояснение к вопросу" v-model="commentModel" />
            <TheInput placeholder="описание картинки" v-model="imageCommentModel" />
        </div>
        <div v-else-if="questionModel.type === 'POSITION'" class="flex flex-wrap gap-6px">
            <AdminAnswer class="w-[calc(100%/2-3px)]" v-for="answer in sortedAnswers" :answer="answer" position />
            <div class="flex w-[calc(100%/2-3px)]">
                <TheInput class="w-1/2" v-model="answerModel.position" >
                    <template #prepend>
                        <p>позиция (1-3):</p>
                    </template>
                </TheInput>
                <TheInput class="w-1/2" v-model="answerModel.title" />
            </div>
            <TheInput placeholder="пояснение к слову" v-model="commentModel" />
            <TheInput placeholder="описание картинки" v-model="imageCommentModel" />
        </div>
        <template v-else-if="questionModel.type === 'VALUE'">
            <div class="flex flex-wrap gap-6px">
                <AdminValue class="w-[calc(100%/2-3px)]" v-for="answer in valueModel" :answer="answer" @remove="removeValueModel"/>
                <div v-for="value in valueModel" class="flex w-[calc(100%/2-3px)]">
                    <TheInput class="w-1/2" v-model="value.question">
                        <template #prepend>
                            <p>цифра: </p>
                        </template>
                    </TheInput>
                    <TheInput class="w-1/2" v-model="value.answer">
                        <template #prepend>
                            <p>буква: </p>
                        </template>
                    </TheInput>
                </div>
            </div>
            <TheInput placeholder="пояснение к слову" v-model="commentModel" />
            <TheInput placeholder="описание картинки" v-model="imageCommentModel" />
        </template>
        <button @click="questionModel.type === 'VALUE' ? addValueModel() : createAnswer()">Добавить ответ</button>
        <button @click="questionEdit" class="ml-5">Сохранить вопрос</button>
        <button @click="questionDeletes" class="ml-5">Удалить вопрос</button>
    </div>
</template>

<style lang="scss">
    .image {
        @apply w-full h-256px object-cover rounded-18px;
    }
</style>