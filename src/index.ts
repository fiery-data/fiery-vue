
import getInstance, {
  define, setGlobalOptions, mergeStrategy, mergeOptions, stats, FieryInstance, FierySources
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
    },
    arraySet: (target: any[], index: number, value: any) =>
    {
      if (target[index] !== value)
      {
        target.splice(index, 1, value)
      }
    },
    arrayResize: (target: any[], size: number) =>
    {
      if (target.length > size)
      {
        target.splice(size, target.length - size)
      }
      else if (target.length < size)
      {
        target.length = size
      }
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
