export interface Tab {
  id: string | number,
  label: string,
  props: {
    closable: boolean
  }
}