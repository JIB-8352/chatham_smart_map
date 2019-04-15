<template>
  <v-dialog v-model="display" persistent max-width="400">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Map Error
      </v-card-title>

      <v-card-text>
        We are unable to load the map right now. You may refresh the page to try
        again.
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click="refresh">
          REFRESH PAGE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    display: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    refresh() {
      location.reload(true);
    }
  }
};
</script>

<style scoped>
.v-dialog {
  z-index: 1;
}
</style>
