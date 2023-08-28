<template>
  <div class="rs-card">
    <img v-lazy="getImageUrl" class="rs-img rounded-2" />
    <table id="customers">
      <tr>
        <th>Название</th>
        <th>Коментарий</th>
        <th>Тип</th>
      </tr>
      <tr>
        <td>James Bond</td>
        <td>007</td>
        <td>007</td>
      </tr>
    </table>
  </div>
</template>

<script setup>
const adminStore = useAdminStore();
const api = import.meta.env.VITE_API;
const { getAnswersById } = toRefs(adminStore);
const props = defineProps({
  question: [Object],
});

const getImageUrl = computed(() => {
  return {
    src: `${api}/${props.question.meta.image}`,
    error: "noimage2.png",
  };
});
const getAnswers = getAnswersById.value(props.question.id);
// const state = ref({
//   id: null,
//   meta: {
//     comment: null,
//     easy: false,
//     image: null,
//     imageComment: null,
//     title: null,
//   },
//   type: "DEFAULT",
//   questions: [],
// });
</script>

<style lang="scss" scoped>
.rs-card {
  padding: 15px;
}

#customers {
  font-size: 14px;
  border-collapse: collapse;
  width: 100%;
}
#customers tr {
  float: left;
  
}
#customers td,
#customers th {
  border: 1px solid #ddd;
  padding: 3px;
  display: block;
  text-align: left;
}

#customers tr:nth-child(even) {
  background-color: #f2f2f2;
}

#customers th {
  padding: 3px 10px;
  text-align: left;
  color: rgb(0, 0, 0);
}
</style>
