/*
 * @Author: Lhh 
 * @Date: 2018-05-17 10:23:18 
 */
import { dispatch } from './index'

class Model {
  constructor ({name, state, reducers, effects}) {
    let args = [].slice.call(arguments)
    this._init(args[0])

    if (!this.name)
      throw new Error('every model must have a name property')
  }
  _init (options) {
    for (let key in options) {
      this[key] = options[key]
    }
    this.attachReducerToModel(options.reducers)
    this.attachEffectToModel(options.effects)
  }
  /**
   * 把effect直接绑定到model上，方便我们直接调用
   * @param {*} effects 
   */
  attachEffectToModel (effects) {
    for (let key in effects) {
      this[key] = effects[key]
      this[key].type = 'effect'
    }
  }
  /**
   * 将传入的reducer做处理（在方法里直接dispatch action，调用方法=dispatch）然后绑定到model上
   * @param {} reducers 
   */
  attachReducerToModel (reducers) {
    for (let key in reducers) {
      this[key] = (payload) => {
        dispatch({type: `${this.name}/${key}`, payload: payload})
      }
      this[key].type = 'action'
    }
  }
  /**
   * 通过传入的reducers对象产生一个reducer纯函数
   */
  createReducer () {
    return (state = this.state, action) => {
      let types = action.type.split('/')
      let name = types[0]
      if (name === this.name) {
        let type = types[1]
        if (type) {
          if (this.reducers[type]) {
            console.log(this.reducers[type](state, action.payload))
            return this.reducers[type](state, action.payload)
          }
        }
      }
      return state
    }
  }
}

export default Model