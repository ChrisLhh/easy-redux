/*
 * @Author: Lhh 
 * @Date: 2018-05-17 10:50:56 
 */

import { createStore, combineReducers, applyMiddleware } from 'redux'
import Model from './model'

class Store {
  constructor ({models, preloadState, middlewares, enhancer}) {
    let options = arguments[0]
    this._init(options)
  }
  /**
   * 初始化
   */
  _init (options) {
    for (let key in options) {
      this[key] = options[key]
    }
    this.modelInstance = this.createModel()
  }
  /**
   * 创建store
   */
  create () {
    let store = null
    let rootReducer = combineReducers(this.combineModelReducer(this.modelInstance))
    store = applyMiddleware(...this.middlewares)(createStore)(rootReducer, this.preloadState)
    this.store = store
    return store
  }
  /**
   * 对原有store的dispatch的扩展
   */
  dispatch ({type, payload}) {
    let types = type.split('/')
    let name = types[0]
    let trueType = types[1]
    let model = this.getModelInstance(name)
    if (!model) {
      throw new Error('not have this model, please build a model')
    }
    if (!model[trueType]) {
      throw new Error('there is not have this reducer or effect in the model, please check')
    }
    if (model[trueType].type === 'action') {
      this.store.dispatch({type: type, payload: payload})
    } else {
      model[trueType].call(model, payload)
    }
  }
  createModel () {
    let modelInstance = this.models.map((model) => {
      return new Model(model)
    })
    return modelInstance
  }
  /**
   * 合并model中的reducer，并返回一个rootReducer
   */
  combineModelReducer (models) {
    let rootReducer = {}
    models.forEach((model) => {
      rootReducer[model.name] = model.createReducer()
    })
    return rootReducer
  }
  /**
   * 根据名字获取相应的model实例
   * @param {*} name 
   */
  getModelInstance (name) {
    let models = this.modelInstance
    for (let i = 0;i < models.length;i++) {
      if (models[i].name === name)
        return models[i]
    }
  }
}

export default Store