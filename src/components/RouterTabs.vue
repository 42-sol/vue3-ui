<template lang='pug'>
.v42-router-tabs
  .v42-tab-pane(ref='pane')
    .v42-tab(
      v-for='(tab, i) in modelValue'
      :key='tab.id'
      :class='tabClasses(tab, "v42-tab")'
      :style='tabMoveStyle(tab, i)'
      @mousedown='onMouseDown'
    )
      slot(name='tab' v-bind='{ tab, activeId }')

        .v42-tab-card(:style='`width: ${tabWidth}px`' :class='tabClasses(tab, "v42-tab-card")' @mousedown='setActiveById(tab.id)')
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
import { defineComponent } from 'vue';

export default defineComponent({
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
      isDragging: true,
      startMouseX: 0,
      moveActiveTab: 0,
      onScrollMoved: 0,
      scrollingIntervalLeft: undefined as undefined | number,
      scrollingIntervalRight: undefined as undefined | number,
      phantomActivePosition: 0
    }
  },
          
  mounted() {
    const paneEl = this.$refs.pane as any;
    paneEl.addEventListener('wheel', this.onPaneScroll);
  },

  computed: {
    activeTab(): Tab | undefined {
      return this.findTabById(this.activeId);
    },
    
    activeIdx() {
      return this.modelValue.findIndex((t: Tab) => t.id === this.activeId)
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
        this.phantomActivePosition = this.activeIdx;
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
    
    tabMoveStyle(tab: Tab, i: number) {
      if (!this.isDragging) {
        return '';
      }
  
      if (this.isActive(tab)) {
        return `transform: translate(${this.moveActiveTab + this.onScrollMoved}px)`
      } else {
        let style = 'transition: transform 0.3s ease;';
    
        if (this.activeIdx >= 0) {
          if ((this.phantomActivePosition <= i && i < this.activeIdx) || (this.activeIdx < i && i <= this.phantomActivePosition)) {
            let sign = this.phantomActivePosition < i ? 1 : -1;
            if (this.phantomActivePosition === i && this.startMouseX > this.startMouseX + this.moveActiveTab + this.onScrollMoved) {
              sign = 1;
            }
            const length = this.tabWidth;
            style += `transform: translate(${sign * length}px);`;
          }
        }

        return style;
      }
    },

    scrollToActive() {
      const paneEl = this.$refs.pane as any;
      const activeTabEl = this.$el.querySelector('.v42-tab--active');

      if (paneEl && activeTabEl) {
        const paneLeft = paneEl.offsetLeft;
        const paneLeftScroll = paneEl.scrollLeft;
        const paneWidth = paneEl.offsetWidth;
        const tabLeft = activeTabEl.offsetLeft;
        const tabWidth = activeTabEl.offsetWidth;

        if (tabLeft < paneLeft + paneLeftScroll) {
          paneEl.scrollLeft += tabLeft - (paneLeft + paneLeftScroll);
        } else if (tabLeft + tabWidth > paneLeft + paneWidth + paneLeftScroll) {
          paneEl.scrollLeft += tabLeft + tabWidth - (paneLeft + paneWidth + paneLeftScroll);
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
      const lastValue = paneEl.scrollLeft
      paneEl.scrollLeft += 50 * e.deltaY / Math.abs(e.deltaY);
      if (this.isDragging) {
        this.onScrollMoved += paneEl.scrollLeft - lastValue;
      }
    },

    onMouseDown(e: MouseEvent) {
      window.addEventListener('mousemove', this.onMouseMove, false);
      window.addEventListener('mouseleave', this.onMouseUp, false);
      window.addEventListener('mouseup', this.onMouseUp, false);
      this.startMouseX = e.pageX;
    },

    onMouseMove(e: MouseEvent) {
      e.preventDefault();
      if (Math.abs(e.pageX - this.startMouseX) > 10) {
        this.isDragging = true;
        this.moveActiveTab = e.pageX - this.startMouseX;
        // this.translateTab();
        this.setNewTabPosition();
      }
    },

    // translateTab() {
    //   const activeTabEl = this.$el.querySelector('.v42-tab--active');
    //   activeTabEl.style.transform = `translateX(${this.moveActiveTab + this.onScrollMoved}px)`
    // },

    setNewTabPosition() {
      const paneEl = this.$refs.pane as any;
      const activeTabEl = this.$el.querySelector('.v42-tab--active');
      
      if (paneEl && activeTabEl) {
        const paneLeft = paneEl.offsetLeft;
        const tabLeft = activeTabEl.offsetLeft;

        this.phantomActivePosition = Math.ceil((tabLeft + this.moveActiveTab + this.onScrollMoved - paneLeft) / this.tabWidth);
      }
    },

    saveNewTabPosition() {
      const tabToMove = this.modelValue.splice(this.activeIdx, 1)[0];
      if (this.phantomActivePosition > this.modelValue.length - 1) {
        this.phantomActivePosition = this.modelValue.length - 1
      }
      this.modelValue.splice(this.phantomActivePosition, 0, tabToMove);
      this.onScrollMoved = 0;
    },

    onMouseUp(e: MouseEvent) {
      e.preventDefault();
      window.removeEventListener('mousemove', this.onMouseMove, false);
      window.removeEventListener('mouseleave', this.onMouseUp, false);
      window.removeEventListener('mouseup', this.onMouseUp, false);
      this.isDragging = false;
      this.saveNewTabPosition();
      this.phantomActivePosition = this.activeIdx;
      this.startMouseX = 0;
      this.moveActiveTab = 0;
      // this.translateTab();
      clearInterval(this.scrollingIntervalLeft);
      this.scrollingIntervalLeft = undefined;
      clearInterval(this.scrollingIntervalRight);
      this.scrollingIntervalRight = undefined;
    }
  }
});
</script>

<style lang='sass' scoped>
.v42-router-tabs
  @apply relative max-w-full overflow-visible text-xs

  ::-webkit-scrollbar
    display: none

.v42-tab-pane
  @apply flex overflow-x-auto relative
  
.v42-tab 
  &--active
    @apply z-50
.v42-tab-card
  @apply border relative rounded-t-xl flex items-center justify-between p-1 bg-gray-300 hover_bg-gray-200 transition

  &--active
    @apply border-b-white bg-white hover_bg-white
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
