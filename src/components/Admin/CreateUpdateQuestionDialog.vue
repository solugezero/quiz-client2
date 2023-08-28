<template>
  <div>
    <!-- BASIC -->
    <el-row class="gap-2">
      <el-col :span="24">
        <img v-if="getImgUrl" :src="getImgUrl"  class="rs-img mb-2 rounded-2"/>
        <el-upload
          :on-change="handleChangeImage"
          drag
          :limit="1"
          :auto-upload="false"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Перетащите файл сюда или <em>нажмите для загрузки</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              Необходимый размер изображения: 680х256
            </div>
          </template>
          <template #file="{ file }">
            <div></div>
          </template>
        </el-upload>
      </el-col>
      <el-col :span="24">
        <p>Название</p>
        <el-input placeholder="Название" v-model="state.meta.title"></el-input>
      </el-col>
      <el-col :span="24">
        <p>Комментарий</p>
        <el-input
          v-model="state.comment"
          :rows="2"
          type="textarea"
          placeholder="Комментарий"
        />
      </el-col>
      <el-col :span="24" v-if="getImgUrl">
        <p>Комментарий к изображению</p>
        <el-input
          v-model="state.imageComment"
          :rows="2"
          type="textarea"
          placeholder="Комментарий к изображению"
        />
      </el-col>
      <el-col :span="24">
      <el-row class="justify-between">
        <el-radio-group v-model="state.type">
          <el-radio-button label="DEFAULT"> Стандартный</el-radio-button>
          <el-radio-button label="POSITION">Позиция</el-radio-button>
          <el-radio-button label="VALUE">Супер-игра</el-radio-button>
        </el-radio-group>
        <el-checkbox v-model="state.meta.easy">Легкий вопрос</el-checkbox>
      </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { UploadFilled } from "@element-plus/icons-vue";
const tempListFile = ref([]);
const state = ref({
  id: null,
  meta: {
    comment: null,
    easy: false,
    image: null,
    imageComment: null,
    title: null,
  },
  type: "DEFAULT",
  questions: [],
});

const getImgUrl = computed(() => {
  if(!state?.value?.meta?.image) return
  return URL.createObjectURL(state?.value?.meta?.image);
});
const handleChangeImage = (data) => {
  state.value.meta.image = data.raw;
};
</script>

<style lang="scss" scoped>
// .rs-image{
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   aspect-ratio: 16/9;
// }

</style>
