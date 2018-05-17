/*
 * @Author: Lhh 
 * @Date: 2018-05-16 11:28:58 
 */

import Store from './store'

let store = null, storeInstance = null

/**
 * 对外暴露的方法，用于创建store
 */
export const createStore  = ({models, preloadState, enhancer}) => {
  storeInstance = new Store({models, preloadState, enhancer})
  store = storeInstance.create()
  return store
}
/**
 * 对外暴露的方法，对原来的store dispatch进行扩展
 */
export const dispatch = ({type, payload}) => {
  if (!store) {
    throw new Error('please use the createStore function to create a store before using dispatch')
  }
  storeInstance.dispatch({type, payload})
}