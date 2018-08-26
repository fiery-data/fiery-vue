
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />

import * as firebase from 'firebase'
import firebasemock from 'fiery-firebase-memory'


export function getStore (name: string, map?: any): firebase.firestore.Firestore
{
  const app = firebasemock.initializeApp({}, name)
  const fs = firebasemock.firestore(app)

  if (map)
  {
    for (var path in map)
    {
      const data: any = fs.dataAt(path, true)
      const copy: any = map[path]

      for (var prop in copy)
      {
        if (copy.hasOwnProperty(prop))
        {
          data[prop] = copy[prop]
        }
      }
    }
  }

  return (<any>fs) as firebase.firestore.Firestore
}

export function getStored (fs: firebase.firestore.Firestore, data: any): any
{
  const uid: string = data['.uid']

  return (<any>fs)._docs[uid.substring(uid.indexOf('///') + 3)]
}
