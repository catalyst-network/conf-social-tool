<template>
  <div />
</template>
<script>
export default {
  mounted() {
    this.$q.loading.show({
      backgroundColor: 'primary',
      messageColor: 'secondary',
      customClass: 'loading',
    });
  },
};
</script>
