<template lang='pug'>
.v42-router-tabs
  .v42-tab-pane(ref='pane')
    .v42-tab(
      v-for='tab in modelValue'
      :key='tab.id'
      :draggable='true'
      :class='tabClasses(tab, "v42-tab")'
    )
      slot(name='tab' v-bind='{ tab, activeId }')

        .v42-tab-card(:style='`width: ${tabWidth}px`' :class='tabClasses(tab, "v42-tab-card")' @click='setActiveById(tab.id)')
          slot(name='icon')

          slot(name='tab-label' v-bind='{ tab, activeId }')
            .v42-tab-label {{ tab.label }}

          slot(name='close' v-bind='{ tab, activeId }' v-if='tab.props && tab.props.closable && modelValue.length > 1')
            .v42-close
              button.v42-close-btn(@click.stop.prevent='closeTab(tab)')
                slot(name='close-btn' v-bind='{ tab, activeId }')
                  img.w-3.h-3(src='/icons/close.svg' alt='x')

    .border-b.w-full

  .v42-content
    slot(name='default' v-if='activeTab' v-bind='{ activeTab }')
</template>

<script lang='ts'>
import { Tab } from '@/types/router-tabs.type';

export default {
  name: '42-RouterTabs',

  props: {
    modelValue: {
      type: Array as () => Tab[],
      default: []
    },
    tabWidth: {
      type: Number,
      default: 80
    }
  },

  data() {
    return {
      activeId: 1 as string | number,
    }
  },
  
  mounted() {
    const paneEl = this.$refs.pane as any;
    paneEl.addEventListener('wheel', this.onPaneScroll);
  },

  computed: {
    activeTab(): Tab | undefined {
      return this.findTabById(this.activeId);
    }
  },

  methods: {

    findTabById(id: string | number): Tab | undefined {
      return this.modelValue.find((t: Tab) => t.id === id);
    },

    setActiveById(id: string | number) {
      if (this.findTabById(id)) {
        this.$emit("on-change", id, this.activeId);
        this.activeId = id;
        this.$nextTick(() => {
          this.scrollToActive();
        });
      }
    },

    tabClasses(tab: Tab, prefix='v42-tab') {
      const classes = [];

      if (tab.id === this.activeId) {
        classes.push(`${prefix}--active`);
      }

      return classes;
    },

    scrollToActive() {
      const paneEl = this.$refs.pane as any;
      const activeTabEl = this.$el.querySelector('.v42-tab-card--active');

      if (paneEl && activeTabEl) {
        const paneLeft = paneEl.offsetLeft;
        const paneLeftScroll = paneEl.scrollLeft;
        const paneWidth = paneEl.offsetWidth;
        const tabLeft = activeTabEl.offsetLeft;
        const tabWidth = activeTabEl.offsetWidth;
        if (tabLeft < paneLeft + paneLeftScroll) {
          return paneEl.scrollLeft += tabLeft - (paneLeft + paneLeftScroll);
        }
        if (tabLeft + tabWidth > paneLeft + paneWidth + paneLeftScroll) {
          return paneEl.scrollLeft += tabLeft + tabWidth - (paneLeft + paneWidth + paneLeftScroll);
        }
      }
    },

    isActive(tab: Tab) {
      if (tab) {
        return tab.id === this.activeId;
      }

      return undefined;
    },

    closeTab(tab: Tab) {
      this.$emit('update:modelValue', this.modelValue.filter((t: Tab) => tab.id !== t.id));
      this.$emit('on-close', tab);
      if (this.isActive(tab)) {
        this.$nextTick(() => {
          this.goToLast();
        })
      }
    },

    goToLast() {
      const lastTab: Tab = this.modelValue[this.modelValue.length - 1];
      this.setActiveById(lastTab.id);
    },

    onPaneScroll(e: WheelEvent) {
      e.preventDefault();
      const paneEl = this.$refs.pane as any;
      paneEl.scrollLeft += 50 * e.deltaY / Math.abs(e.deltaY);
    }
  }
}
</script>

<style lang='sass' scoped>
.v42-router-tabs
  @apply relative max-w-full overflow-visible text-xs

  ::-webkit-scrollbar
    display: none

.v42-tab-pane
  @apply flex overflow-x-auto
// .v42-tab 
.v42-tab-card
  @apply border relative rounded-t-xl flex items-center justify-between p-1 bg-gray-300 hover_bg-gray-200 transition

  &--active
    @apply border-b-0 bg-white z-50 hover_bg-white
.v42-tab-label
  @apply block truncate p-1 w-full
.v42-close
  @apply flex-shrink-0 flex-1 inline-block w-6 h-6
.v42-close-btn
  @apply rounded-full flex items-center justify-center w-6 h-6
  &:hover
    @apply bg-blue-100
  &:active
    @apply bg-blue-200
// .v42-content
</style>
