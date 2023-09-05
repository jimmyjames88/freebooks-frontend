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
    gap: 4rem;
    min-height: 100dvh;
    align-items: center;
    
    .left {
      width: 50%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .right {
      width: 50%;
    }
  }
}
</style>