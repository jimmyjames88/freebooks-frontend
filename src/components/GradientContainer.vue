<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GradientContainer',
  props: {
    bgColor: {
      type: String,
      default: '#FE6D73'
    }
  }
})
</script>

<template>
  <div class="gradient-container">
    <div class="content">
      <div class="left">
        <slot name="left" />
      </div>
      <div class="right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'vuetify/lib/styles/settings/_variables';

.gradient-container {
  color: #FFFFFF; 
  min-height: 100dvh; 
  background-color: v-bind(bgColor);

  :deep(.v-btn.bg-transparent) {
    color: rgba(var(--v-theme-on-primary)) !important;
  }

  :deep(.right) .v-form {
    max-width: 400px;
  }

  &::before {
    position: absolute;
    display: block;
    z-index: 1;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    content: '';
    background: radial-gradient(#FFFFFF, transparent) !important;
    opacity: 0.2;
  }

  > .content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 0rem;
    min-height: 100dvh;
    justify-content: center;
    align-items: center;
    
    .left, .right {
      display: flex;
      width: 400px;
      max-width: 100%;
      justify-content: center;
      padding: 1rem;

      > :deep(.v-form) {
        width: 100%;
      }
    }
  }
}

@media #{map-get($display-breakpoints, 'md-and-up')} {
  .gradient-container > .content {
    flex-direction: row;
    .left, .right {
      width: 50%;
    }

    .left {
      justify-content: end;
    }

    .right {
      justify-content: start;
    }
  }
}
</style>