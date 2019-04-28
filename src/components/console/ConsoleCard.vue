<template>
  <div class="card" :class="{ scroll: scrollable }">
    <h2>{{ heading }}</h2>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String,
      required: true
    },
    scrollable: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.card {
  background-color: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 3px;
  padding: 5px;
}

.card:hover {
  box-shadow: 0 10px 18px 0 rgba(0, 0, 0, 0.2);
}

.card > * {
  margin: 0.7em;
}

/* flex-grow so that it can take up the remaining space. We only want the last ConsoleCard to be
scrollable/have this property. The height limit is decided by max-height of TheConsole. */
.scroll {
  flex-grow: 1;
  overflow-y: scroll;
}

/* The line height will ensure that when the text wraps, it doesn't intersect. */
h2 {
  font-size: 15px;
  line-height: 14px;
}
</style>
