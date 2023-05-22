<template lang='pug'>
.m-4
  RouterTabs(
    v-model='tabs'
    :tab-width='140'
  )
    template(#default='{ activeTab }')
      p
        h3 {{ activeTab.label }}
</template>

<script lang="ts">
import RouterTabs from './components/RouterTabs.vue';

export default {
  components: { RouterTabs },
  data() {
    return {
      tabs: [
        { id: 1, label: 'Tab1', props: {}, listeners: {} },
        { id: 2, label: 'Tab2', props: { closable: true }, listeners: {} },
        { id: 3, label: 'Tab3', props: { closable: true }, listeners: {} },
        { id: 4, label: 'Tab4', props: { closable: true }, listeners: {} },
        { id: 5, label: 'Tab5', props: { closable: true }, listeners: {} },
        { id: 6, label: 'Tab6', props: { closable: true }, listeners: {} },
        { id: 7, label: 'Tab7', props: { closable: true }, listeners: {} },
        { id: 8, label: 'Tab8', props: { closable: true }, listeners: {} },
        { id: 9, label: 'Tab9', props: { closable: true }, listeners: {} },
        { id: 10, label: 'Tab10', props: { closable: true }, listeners: {} },
        { id: 11, label: 'Tab11', props: { closable: true }, listeners: {} },
        { id: 12, label: 'Tab12', props: { closable: true }, listeners: {} },
        { id: 13, label: 'Tab13', props: { closable: true }, listeners: {} },
        { id: 14, label: 'Tab14', props: { closable: true }, listeners: {} }
      ]
    }
  }
}
</script>

<style scoped>

</style>
