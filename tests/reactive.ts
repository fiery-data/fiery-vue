
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />
/// <reference path="../node_modules/fiery-data/dist/types/types.d.ts" />

import { getStore, getStored } from './util'
import { expect } from 'chai'
import FieryVue from '../src'
import * as Vue from 'vue'

describe('reactive', function()
{
  const VueTest: any = Vue

  before(function() {
    VueTest.use(FieryVue)
  })

  it('recomputes', function()
  {
    const fs = getStore('reactive recomputes', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true },
      'todos/3': { name: 'T3', done: false },
      'todos/4': { name: 'T4', done: true },
      'todos/5': { name: 'T5', done: true }
    })

    class Todo {
      name: string = ''
      done: boolean = false
    }

    const TodoOptions = {
      shared: true,
      type: Todo,
      include: ['name', 'done']
    }

    const vm = new VueTest({
      fiery: true,
      beforeCreate() {
        this.recomputed = 0
      },
      data() {
        return {
          done: true
        }
      },
      computed: {
        results(): Todo[] {
          this.recomputed++
          const options = {
            extends: TodoOptions,
            query: q => q.where('done', '==', this.done)
          }
          return this.$fiery(fs.collection('todos'), options, 'results')
        }
      }
    })

    expect(vm.recomputed).to.equal(0)
    expect(vm.results.length).to.equal(3)
    expect(vm.recomputed).to.equal(1)

    vm.done = false

    expect(vm.results.length).to.equal(2)
    expect(vm.recomputed).to.equal(2)

    vm.done = true

    expect(vm.results.length).to.equal(3)
    expect(vm.recomputed).to.equal(3)

    vm.$destroy()

    expect(vm.recomputed).to.equal(3)
  })

})
