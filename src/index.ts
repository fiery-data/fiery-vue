
import getInstance, {
  define, setGlobalOptions, mergeStrategy, mergeOptions, stats, callbacks, FieryInstance, FierySources
} from 'fiery-data'


export interface FieryVue
{
  $fiery: FieryInstance

  $fires: FierySources

  [prop: string]: any

  $delete: (object: any, key: string | number) => any

  $set: (object: any, key: string | number, value?: any) => any
}

export function init (this: FieryVue)
{
  if (!this.$options.fiery)
  {
    return
  }

  this.$fiery = getInstance(
  {
    removeNamed: (name: string) =>
    {
      this[name] = null
    },
    setProperty: (target: any, property: string, value: any) =>
    {
      this.$set(target, property, value)
    },
    removeProperty: (target: any, property: string) =>
    {
      this.$delete(target, property)
    }
  })

  this.$fires = this.$fiery.sources
}

export function link (this: FieryVue)
{
  if (this.$fiery)
  {
    this.$fiery.linkSources(this)
  }
}

export function destroy (this: FieryVue)
{
  if (this.$fiery)
  {
    this.$fiery.destroy()
  }
}

export const plugin =
{
  mergeOptions,

  mergeStrategy,

  define,

  setGlobalOptions,

  stats,

  callbacks,

  install (Vue: any)
  {
    Vue.config.optionMergeStrategies.fiery = (a, b) => {
      return a || b
    }

    Vue.mixin({
      beforeCreate: init,
      created: link,
      beforeDestroy: destroy
    })
  }
}

export default plugin
